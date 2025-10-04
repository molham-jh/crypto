import React from 'react';
import './index.css';
import './App.css';
import Navbar from './component/navbar/Navbar';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Coin from './pages/Coin/Coin';
import Footer from './component/footer/Footer';
import SignupForm, { FormProvider } from './component/loginForm/Login'; // ✅ Import the FormProvider
import Confirm from './component/confirm/Confirm';
import Invest from './invest/invest';
import Account from './account/profile/profile';
import Location from './account/sttings/Location/lacation'
import SideBar from './sideBar/SideBar';
import Accounts  from './AccountsOutThere/AccountsOutThre';
import Setting from  './account/sttings/generalSettings/sttings';
import LanguageSwitcher from './account/sttings/languages/LangSwitcher'
import './account/sttings/languages/i18n' ;
import EditProfile from './account/sttings/editProfile/EditProfile';
import CreditCardForm from './invest/creditInfo/Creditinfo';
import InvestmentSummary from './invest/inestmentResult/InvestMentResult';
import Intro from './Intro'
import Logout from './logout/Logout'
import FakeSupport from './fakeSupport/FakeSupport';
import WarningModal from './alert'
const App = () => {
  return (
    <div className="app">
      <Navbar />

      {/* ✅ Wrap everything that uses `useForm()` */}
      
      <FormProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Coin/:CoinID" element={<Coin />} />
          <Route path="/login-form" element={<SignupForm />} />
          <Route path="/login-form/confirm" element={<Confirm />} />
          <Route path="/invest-in-crypto" element={<Invest />} />
          <Route path="/My-account" element={<Account />} />/
          <Route path='/my-location' element={<Location/>}/>
          <Route path='/Accounts' element={<Accounts/>}/>
          <Route path='/settings' element={<Setting/>}/>
          <Route path='/setting' element={<LanguageSwitcher/>}/>
          <Route path='/setting/editProfile' element={<EditProfile/>}/>
          <Route path='/creditcardinfo' element={<CreditCardForm/>}/>
          <Route path='/investment-info' element={<InvestmentSummary/>}/>
          <Route path='/logout' element={<Logout/>}/>
          <Route path='/fakesupport' element={<FakeSupport/>}/>
        </Routes>
      </FormProvider>
      <Intro/>
      <SideBar/>
      <WarningModal/>
      <Footer />
    </div>
  );
};

export default App;
