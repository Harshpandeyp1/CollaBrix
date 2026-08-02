import React, { useState, useEffect } from 'react'
import ProfileHeader from '../Components/ProfileHeader'
import ProfileAbout from '../Components/ProfileAbout'
import ErrorBoundary from '../Components/ErrorBoundary'
import Navbar from '../Components/Navbar'
import EditProfile from '../Components/EditProfile'
import { getProfile } from '../Services/Profile.js'

const ProfilePage = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (error) {
      console.error('Failed to fetch profile', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileUpdated = async () => {
    setEditOpen(false);
    await fetchProfile();
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen w-full flex flex-col items-center py-1 px-4 ">
          <div className="mt-20 text-center text-gray-600">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar/>
      <div className="min-h-screen w-full flex flex-col items-center py-1 px-4 bg-gradient-to-b from-sky-200 via-teal-100 to-blue-100">

        <ErrorBoundary>
          <ProfileHeader
            profile={profile}
            onEdit={() => setEditOpen(true)}
            onProfileImageUpdated={fetchProfile}
            onCoverImageUpdated={fetchProfile}
          />
        </ErrorBoundary>

        <ProfileAbout
          profile={profile}
        />
        <EditProfile
          open={editOpen}
          profile={profile}
          onClose={() => setEditOpen(false)}
          onSave={handleProfileUpdated}
        />
      </div>
    </div>
  )
}

export default ProfilePage