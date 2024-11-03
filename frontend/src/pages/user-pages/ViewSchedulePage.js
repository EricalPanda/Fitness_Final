import React from 'react'
import Navbar from '../../components/user-components/Navbar';
import Footer from '../../components/user-components/Footer';
import PageHeader from "../../components/user-components/PageHeader";
import ViewSchedules from '../../components/user-components/ViewSchedules';
import HorizontalMenu from '../../components/user-components/HorizontalMenu';

export default function ViewSchedulePage() {
    return (
        <>
            <Navbar />
            <PageHeader title="Schedule" readOnly />
            <HorizontalMenu />
            <ViewSchedules />
            <Footer />
        </>
    )
}
