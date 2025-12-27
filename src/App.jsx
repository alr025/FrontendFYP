import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./Login";
import UserHomePage from "./UserHomePage";
import DonorPage from "./DonorPage";
import NearbyBloodBank from "./NearbyBloodBank";
import MapModal from "./MapModal";
import UserFaq from "./UserFaq";
import RequestPage from "./RequestPage";
import BloodCampPage from "./BloodCampPage";
import FamilyMembers from "./FamilyMembers";

import OrganizationHomePage from "./OrganizationHomePage";
import HospitalHomePage from "./HospitalHomePage";

import ManageCamps from "./ManageCamps";
import DonorList from "./DonorList";
import ViewRequests from "./ViewRequests";
import OrganizationBloodBank from "./OrganizationBloodBank";


import HospitalInventory from "./HospitalInventory";
import HospitalRequests from "./HospitalRequests";
import HospitalDonors from "./HospitalDonors";
import HospitalAddStock from "./HospitalAddStock";
import HospitalLocations from "./HospitalLocations";
import HospitalProfile from "./HospitalProfile";

function App() {
  return (
    <Router>
      <Routes>

        {/* --- User Routes --- */}
        <Route path="/" element={<Login />} />
        <Route path="/UserHomePage" element={<UserHomePage />} />
        <Route path="/donor" element={<DonorPage />} />
        <Route path="/blood-bank/nearby" element={<NearbyBloodBank />} />
        <Route path="/request" element={<RequestPage />} />
        <Route path="/map-modal" element={<MapModal />} />
        <Route path="/Userfaq" element={<UserFaq />} />
        
        {/* ❌ Removed ProfilePage because it is undefined */}
        {/* <Route path="/profile" element={<ProfilePage />} /> */}

        <Route path="/camp" element={<BloodCampPage />} />

        {/* Family members */}
        /*<Route path="/family-members" element={<FamilyMembers />} />*/
        <Route path="/familymembers" element={<FamilyMembers />} />

        {/* --- Organization Routes --- */}
        <Route path="/OrganizationHomePage" element={<OrganizationHomePage />} />
        <Route path="/org/camps" element={<ManageCamps />} />
        <Route path="/org/donors" element={<DonorList />} />
        <Route path="/org/requests" element={<ViewRequests />} />
        <Route path="/org/bloodbank" element={<OrganizationBloodBank />} />

        {/* --- Hospital Routes --- */}
        <Route path="/HospitalHomePage" element={<HospitalHomePage />} />
        <Route path="/hospital/inventory" element={<HospitalInventory />} />
        <Route path="/hospital/requests" element={<HospitalRequests />} />
        <Route path="/hospital/donors" element={<HospitalDonors />} />
        <Route path="/hospital/add-stock" element={<HospitalAddStock />} />
        <Route path="/hospital/locations" element={<HospitalLocations />} />
        <Route path="/hospital/profile" element={<HospitalProfile />} />

      </Routes>
    </Router>
  );
}

export default App;
