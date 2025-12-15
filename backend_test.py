import requests
import sys
import json
from datetime import datetime

class ClipTagAPITester:
    def __init__(self, base_url="https://videoai-saas.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test": name,
            "success": success,
            "details": details
        }
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {name}")
        if details:
            print(f"    {details}")

    def run_test(self, name, method, endpoint, expected_status, data=None, auth_required=False):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if auth_required and self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=30)

            success = response.status_code == expected_status
            
            if success:
                try:
                    response_data = response.json()
                    self.log_test(name, True, f"Status: {response.status_code}")
                    return True, response_data
                except:
                    self.log_test(name, True, f"Status: {response.status_code} (No JSON response)")
                    return True, {}
            else:
                try:
                    error_data = response.json()
                    self.log_test(name, False, f"Expected {expected_status}, got {response.status_code} - {error_data}")
                except:
                    self.log_test(name, False, f"Expected {expected_status}, got {response.status_code}")
                return False, {}

        except Exception as e:
            self.log_test(name, False, f"Error: {str(e)}")
            return False, {}

    def test_health_endpoints(self):
        """Test basic health endpoints"""
        print("\n🔍 Testing Health Endpoints...")
        
        self.run_test("API Root", "GET", "", 200)
        self.run_test("Health Check", "GET", "health", 200)

    def test_auth_flow(self):
        """Test complete authentication flow"""
        print("\n🔍 Testing Authentication Flow...")
        
        # Generate unique test user
        timestamp = datetime.now().strftime('%H%M%S')
        test_email = f"test_user_{timestamp}@example.com"
        test_password = "TestPass123!"
        test_name = f"Test User {timestamp}"

        # Test registration
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data={
                "name": test_name,
                "email": test_email,
                "password": test_password
            }
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.user_id = response['user']['id']
            self.log_test("Registration Token Received", True, f"User ID: {self.user_id}")
        else:
            self.log_test("Registration Token Received", False, "No token in response")
            return False

        # Test login with same credentials
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data={
                "email": test_email,
                "password": test_password
            }
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']  # Update token
            self.log_test("Login Token Received", True)
        else:
            self.log_test("Login Token Received", False, "No token in response")

        # Test get current user
        self.run_test("Get Current User", "GET", "auth/me", 200, auth_required=True)

        # Test invalid login
        self.run_test(
            "Invalid Login",
            "POST",
            "auth/login",
            401,
            data={
                "email": test_email,
                "password": "wrongpassword"
            }
        )

        return True

    def test_ai_generation_endpoints(self):
        """Test all AI generation endpoints"""
        if not self.token:
            self.log_test("AI Generation Tests", False, "No authentication token available")
            return

        print("\n🔍 Testing AI Generation Endpoints...")

        # Test video clip generation (uses form data)
        self.test_video_clip_generation()

        # Test story generation
        success, story_result = self.run_test(
            "Generate Story",
            "POST",
            "generate/story",
            200,
            data={
                "topic": "A day in the life of a successful entrepreneur",
                "style": "dramatic",
                "length": "short"
            },
            auth_required=True
        )

        # Test voiceover generation
        success, voiceover_result = self.run_test(
            "Generate Voiceover",
            "POST",
            "generate/voiceover",
            200,
            data={
                "text": "Welcome to our amazing product demonstration",
                "voice_style": "professional"
            },
            auth_required=True
        )

        # Test transcription generation
        success, transcription_result = self.run_test(
            "Generate Transcription",
            "POST",
            "generate/transcription",
            200,
            data={
                "video_description": "A tutorial about using AI tools for content creation"
            },
            auth_required=True
        )

        # Test ranking generation
        success, ranking_result = self.run_test(
            "Generate Ranking",
            "POST",
            "generate/ranking",
            200,
            data={
                "video_title": "How to Make Money Online in 2024",
                "niche": "business"
            },
            auth_required=True
        )

        # Test split-screen generation (uses form data)
        self.test_split_screen_generation()

    def test_split_screen_generation(self):
        """Test split-screen generation with form data"""
        if not self.token:
            return
            
        url = f"{self.base_url}/generate/split-screen"
        headers = {'Authorization': f'Bearer {self.token}'}
        
        form_data = {
            'video_topic': 'React vs Vue comparison',
            'style': 'educational', 
            'duration': '90s'
        }
        
        try:
            response = requests.post(url, data=form_data, headers=headers, timeout=30)
            success = response.status_code == 200
            
            if success:
                self.log_test("Generate Split Screen", True, f"Status: {response.status_code}")
            else:
                try:
                    error_data = response.json()
                    self.log_test("Generate Split Screen", False, f"Expected 200, got {response.status_code} - {error_data}")
                except:
                    self.log_test("Generate Split Screen", False, f"Expected 200, got {response.status_code}")
        except Exception as e:
            self.log_test("Generate Split Screen", False, f"Error: {str(e)}")

    def test_library_endpoints(self):
        """Test library management endpoints"""
        if not self.token:
            self.log_test("Library Tests", False, "No authentication token available")
            return

        print("\n🔍 Testing Library Endpoints...")

        # Get library (should work even if empty)
        success, library_data = self.run_test(
            "Get Library",
            "GET",
            "library",
            200,
            auth_required=True
        )

        # If we have items in library, test deletion
        if success and library_data and len(library_data) > 0:
            item_id = library_data[0]['id']
            self.run_test(
                "Delete Library Item",
                "DELETE",
                f"library/{item_id}",
                200,
                auth_required=True
            )

        # Test deleting non-existent item
        self.run_test(
            "Delete Non-existent Item",
            "DELETE",
            "library/non-existent-id",
            404,
            auth_required=True
        )

    def test_profile_endpoints(self):
        """Test profile management endpoints"""
        if not self.token:
            self.log_test("Profile Tests", False, "No authentication token available")
            return

        print("\n🔍 Testing Profile Endpoints...")

        # Test profile update
        self.run_test(
            "Update Profile",
            "PUT",
            "profile",
            200,
            data={"name": "Updated Test User"},
            auth_required=True
        )

    def test_unauthorized_access(self):
        """Test endpoints without authentication"""
        print("\n🔍 Testing Unauthorized Access...")

        # Test protected endpoints without token
        old_token = self.token
        self.token = None

        self.run_test("Unauthorized Library Access", "GET", "library", 403, auth_required=True)
        self.run_test("Unauthorized Profile Access", "GET", "auth/me", 403, auth_required=True)
        self.run_test("Unauthorized AI Generation", "POST", "generate/story", 403, 
                     data={"topic": "test", "style": "engaging", "length": "short"}, 
                     auth_required=True)

        # Restore token
        self.token = old_token

    def run_all_tests(self):
        """Run complete test suite"""
        print("🚀 Starting ClipTag AI API Test Suite")
        print(f"📍 Testing endpoint: {self.base_url}")
        print("=" * 60)

        # Run all test categories
        self.test_health_endpoints()
        
        if self.test_auth_flow():
            self.test_ai_generation_endpoints()
            self.test_library_endpoints()
            self.test_profile_endpoints()
            self.test_unauthorized_access()
        else:
            print("❌ Authentication failed - skipping protected endpoint tests")

        # Print final results
        print("\n" + "=" * 60)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} tests failed")
            
            # Print failed tests
            print("\n❌ Failed Tests:")
            for result in self.test_results:
                if not result['success']:
                    print(f"   - {result['test']}: {result['details']}")
            
            return 1

def main():
    tester = ClipTagAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())