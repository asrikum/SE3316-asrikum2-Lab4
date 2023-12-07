import styles from ".";
import React, { useEffect, useState } from "react";
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
    AdminDashboard
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
    if (isAdmin) {
        // If the user is an admin, only show the AdminDashboard
        return (
            <div>
                <div className={styles.main_container}>
                    <nav className={styles.navbar}>
                        {/* Navbar content */}
                        <button className={styles.white_btn} onClick={handleLogout}>
                            Logout
                        </button>
                    </nav>
                </div>
                <AdminDashboard />
            </div>
        );
    } else {
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
                <>
                    <SuperheroesSearch />
                    <ListForm />
                    <EditListForm />
                    <ReviewForm />
                    <DeleteListForm />     
                    <DisplayResults />
                    <GetAllPublishersComponent />
                    <HeroLists />
                    
                </>
            ) : (
                <div>
                    <p>Your email is not verified. Please verify to access all features.</p>
                    <SuperheroesSearch />
                    <HeroLists />
                </div>
            )}

            
        </div>
    );
};
}

export default Main;
