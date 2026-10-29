import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../Components/Navbar";

import ProfileHeader from "../Components/ProfileHeader";
import ProfileAbout from "../Components/ProfileAbout";
import FeaturedSection from "../Components/FeaturedSection";
import ExperienceSection from "../Components/ExperienceSection";
import EducationSection from "../Components/EducationSection";
import Activity from "../Components/Activity";
import ProjectSection from "../Components/ProjectSection";
import { getProfileByUserId } from "../Services/Profile.js";

const OtherProfile = () => {

    const { userId } = useParams();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, [userId]);

    const fetchProfile = async () => {

        try {

            setLoading(true);

            const result = await getProfileByUserId(userId);
            setProfile(result);

        } catch (error) {

            console.error("Error fetching profile:", error);

        } finally {

            setLoading(false);
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFBD4] dark:bg-black">
                Loading profile...
            </div>
        );
    }


    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFBD4] dark:bg-black">
                Profile not found
            </div>
        );
    }


    return (
        <div>

            <Navbar />

            <div className="
                min-h-screen
                w-full
                bg-[#FDFBD4]
                dark:bg-black
                px-4
                py-6
            ">

                <div className="max-w-7xl mx-auto">

                    <main className="space-y-6">

                        <ProfileHeader
                            profile={profile}
                        />

                        <ProfileAbout
                            profile={profile}
                        />

                        <FeaturedSection userId={profile.id} />

                        <ExperienceSection userId={profile.id} />

                        <EducationSection userId={profile.id} />

                        <Activity />

                        <ProjectSection userId={profile.id}/>

                    </main>

                </div>

            </div>

        </div>
    );
};

export default OtherProfile;