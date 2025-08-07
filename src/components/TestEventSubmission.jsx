import React, { useState } from 'react';
import Button from './ui/Button';

const TestEventSubmission = ({ onSubmit }) => {
  const [testRole, setTestRole] = useState('artist');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mockFormData = {
    basicInfo: {
      title: "Test Cultural Event",
      description: "This is a test event submission to verify role-based access and functionality.",
      category: "classical-dance",
      subcategory: "Kathakali",
      startDate: "2024-12-01",
      endDate: "2024-12-01",
      startTime: "19:00",
      endTime: "21:00",
      ageRestriction: "All ages welcome"
    },
    venue: {
      venueName: "Test Cultural Center",
      address: "123 Culture Street, Kochi",
      city: "Kochi",
      capacity: "100",
      latitude: 9.9312,
      longitude: 76.2673
    },
    ticketing: {
      isFree: false,
      ticketTiers: [
        {
          name: "General",
          price: 500,
          quantity: 100
        }
      ]
    },
    media: {
      featuredImage: "https://example.com/test-image.jpg",
      culturalDocumentation: "This event celebrates traditional Kerala art forms."
    }
  };

  const testUsers = {
    admin: {
      id: "test-admin-123",
      name: "Test Admin",
      email: "admin@keralahub.com",
      role: "admin"
    },
    artist: {
      id: "test-artist-123", 
      name: "Test Artist",
      email: "artist@keralahub.com",
      role: "artist"
    },
    organizer: {
      id: "test-organizer-123",
      name: "Test Organizer", 
      email: "organizer@keralahub.com",
      role: "organizer"
    },
    user: {
      id: "test-user-123",
      name: "Test User",
      email: "user@keralahub.com", 
      role: "user"
    }
  };

  const handleTestSubmission = async () => {
    setIsSubmitting(true);
    try {
      // Set the test user in localStorage
      const testUser = testUsers[testRole];
      localStorage.setItem('kerala_demo_user', JSON.stringify(testUser));
      
      console.log(`Testing event submission for ${testRole} role:`, testUser);
      
      // Call the parent submission handler
      await onSubmit(mockFormData);
      
      console.log(`✅ Event submission successful for ${testRole} role`);
    } catch (error) {
      console.error(`❌ Event submission failed for ${testRole} role:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 m-4">
      <h3 className="font-heading font-semibold text-lg mb-4">Test Event Submission</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Test Role:</label>
        <select 
          value={testRole} 
          onChange={(e) => setTestRole(e.target.value)}
          className="w-full p-2 border border-border rounded-md"
        >
          <option value="admin">Admin</option>
          <option value="artist">Artist</option>
          <option value="organizer">Organizer</option>
          <option value="user">User (should fail)</option>
        </select>
      </div>

      <div className="mb-4 text-sm text-muted-foreground">
        <p><strong>Expected Results:</strong></p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li><strong>Admin:</strong> ✅ Should succeed - Can create events</li>
          <li><strong>Artist:</strong> ✅ Should succeed - Can create events</li>
          <li><strong>Organizer:</strong> ✅ Should succeed - Can create events</li>
          <li><strong>User:</strong> ❌ Should fail - No permission to create events</li>
        </ul>
      </div>

      <div className="mb-4 p-3 bg-muted rounded-md">
        <p className="text-sm"><strong>Test Event Details:</strong></p>
        <p className="text-xs text-muted-foreground mt-1">
          Title: {mockFormData.basicInfo.title}<br/>
          Category: {mockFormData.basicInfo.category}<br/>
          Venue: {mockFormData.venue.venueName}<br/>
          Date: {mockFormData.basicInfo.startDate} at {mockFormData.basicInfo.startTime}
        </p>
      </div>

      <Button
        onClick={handleTestSubmission}
        disabled={isSubmitting}
        variant="default"
        className="w-full"
      >
        {isSubmitting ? `Testing ${testRole} submission...` : `Test ${testRole} Event Submission`}
      </Button>

      <div className="mt-4 text-xs text-muted-foreground">
        <p>💡 <strong>Tip:</strong> Check browser console for detailed test results</p>
        <p>🔍 <strong>Debug:</strong> Open F12 Developer Tools to see logs</p>
      </div>
    </div>
  );
};

export default TestEventSubmission;