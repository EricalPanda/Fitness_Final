import React from 'react'
import Navbar from '../../components/user-components/Navbar';
import Footer from '../../components/user-components/Footer';
import PageHeader from "../../components/user-components/PageHeader";
import Survey from '../../components/user-components/SurveyUser';

export default function SurveyUserPage() {
    return (
        <>
            <Navbar />
            <PageHeader title="Carry out healthy survey" readOnly />
            <Survey />
            <Footer />
        </>
    )
}