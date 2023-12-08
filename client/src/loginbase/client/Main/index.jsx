import styles from ".";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import PolicyPage from "../Admin/policy";
import { 
    ListResults, 
    SuperheroesDataComponent, 
    SuperheroList, 
    SuperheroesSearch, 
    DisplayResults, 
    GetAllPublishersComponent,
    ListForm,
    HeroLists,
    EditListForm, 
    ReviewForm, 
    DeleteListForm,
    AdminDashboard,
    Private
} from '../../../Components/searchsuper';

const Main = () => {
    const [isVerified, setIsVerified] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        
        // Assuming the verification and admin status are stored in local storage
        const verified = localStorage.getItem("isVerified") === 'true';
        const admin = localStorage.getItem("isAdmin") === 'true';
        setIsVerified(verified);
        setIsAdmin(admin);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("isVerified");
        localStorage.removeItem("isAdmin");
        window.location.reload();
    };

    const commonNavBar = () => (
        <nav className={styles.navbar}>
            <button className={styles.white_btn} onClick={handleLogout}>Logout</button>
            <div></div>
            <Link to="/apolicy" className={styles.link}>Security and Privacy Policy</Link>
            <div></div>
            <Link to="/policy" className={styles.link}>Acceptable User Policy</Link>
            <div></div>
            <Link to="/DMCA" className={styles.link}>DMCA Form</Link>
            <div></div>
            <Link to="/DMCATools" className={styles.link}>DMCA Tools</Link>
            

        </nav>
    );

   
        return (  
            
            <div>
            <div className={styles.main_container}>
                {commonNavBar()}
            </div>
                {isAdmin ? (
                    <AdminDashboard />
                ) : (
                         
                isVerified ? (
                    <>
                          <SuperheroesSearch />
                    <ListForm />
                    <EditListForm />
                    <ReviewForm />
                    <DeleteListForm />     
                    <DisplayResults />
                    <GetAllPublishersComponent />
                    <Private />
                    </>
                ) : (
                    <div>
                        <p>Your email is not verified. Please verify to access all features.</p>
                        <SuperheroesSearch />
                    <HeroLists />
                    </div>

                )
                )}
            </div>
            
        );
    }


export default Main;
