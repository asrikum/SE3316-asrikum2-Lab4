import styles from ".";
import React from 'react';
import { useEffect, useState } from "react";
import { 
	ListResults, 
	SuperheroesDataComponent, 
	SuperheroList, 
	SuperheroesSearch, 
	DisplayResults, 
	GetAllPublishersComponent,
	ListForm,
	HeroLists,
	EditListForm
  } from '../../../Components/searchsuper';

  const Main = () => {
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        // Assuming the verification status is stored in local storage
        // Adjust this to match how you're storing the verification status
        const verified = localStorage.getItem("isVerified") === 'true';
        setIsVerified(verified);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user"); // Assuming you store user data here
        window.location.reload();
    };

    return (
        <div>
            <div className={styles.main_container}>
                <nav className={styles.navbar}>
                    <h1>Superhero</h1>
                    <h2>A site to help fans find info about their favourite heroes, as well as organizing them into stored lists</h2>
                    <button className={styles.white_btn} onClick={handleLogout}>
                        Logout
                    </button>
                </nav>
            </div>
            {isVerified ? (
                // Content for verified users
                <>
                    <SuperheroesSearch />
                    <ListForm />
                    <EditListForm />     
                    <DisplayResults />
                    <GetAllPublishersComponent />
                    <HeroLists />
                </>
            ) : (
                // Content for unverified users
                <div>
                    <p>Your email is not verified. Please verify to access all features.</p>
                    {/* You can add more content or instructions for unverified users here */}
                </div>
            )}
        </div>
    );
};

export default Main;
