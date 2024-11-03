import React from 'react'
import Navbar from '../../components/user-components/Navbar';
import PageHeader from '../../components/user-components/PageHeader';
import Footer from '../../components/user-components/Footer';
import UserProfile from '../../components/user-components/UserProfile';


export default function UserProfilePage() {
    return (
        <>
            <Navbar />
            <PageHeader title="User Profile" readOnly />
            <UserProfile />
            <Footer />
        </>
    )
}
