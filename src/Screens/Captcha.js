import {
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useState} from 'react';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import CheckBox from 'react-native-check-box';
// import CyberSiaraCaptcha from 'react-native-siarashield';
import envs from '../Config/envs';
import CyberSiaraCaptcha from '../CyberSiaraComponent/CyberSiaraCaptcha';

const Captcha = () => {

  const [isLogin, setIsLogin] = useState(false);

  const [isChecked, setisChecked] = useState(false);

  const loginVisible = data => {
    setIsLogin(data);
  };

  return (
    <View style={styles.MainContainer}>
      <View style={styles.SecondViewContainer}>
        <Image source={require('../Images/logo.png')} style={styles.MainLogo} />

        <View style={{alignItems: 'flex-start'}}>
          <Text style={styles.InputTitleText}>Email</Text>
        </View>
        <View style={styles.InputViewContainer}>
          <TextInput
            placeholder="Example@email.com"
            style={{width: '90%', fontSize: 18}}
          />
          <FontistoIcon
            name="email"
            size={25}
            color={'orange'}
            style={{paddingTop: 10}}
          />
        </View>

        <View style={{alignItems: 'flex-start', zIndex: 1}}>
          <Text style={styles.InputTitleText}>Password</Text>
        </View>
        <View style={styles.InputViewContainer}>
          <TextInput
            placeholder="********"
            secureTextEntry={true}
            style={{width: '90%', fontSize: 18}}
          />
          <FontistoIcon
            name="locked"
            size={25}
            color={'orange'}
            style={{paddingTop: 10}}
          />
        </View>

        <View style={{marginLeft: 15}}>
          <CheckBox
            onClick={() => {
              {
                isChecked === true ? setisChecked(false) : setisChecked(true);
              }
            }}
            checkBoxColor={'#d9dbda'}
            isChecked={isChecked}
            rightText={'Remember Password'}
          />
        </View>

        <CyberSiaraCaptcha
          isLogin={isLogin}
          PUBLIC_KEY = 'dfMWQA8s9m1QHSdLxyITXfJUqTh8gW7D'
          PRIVATE_KEY
          loginVisible={data => loginVisible(data)}
        />

        {isLogin ? (
          <View style={styles.LoginButton}>
            <Button
              title="LOGIN"
              color="orange"
              onPress={() => alert('Login Here ...')}
            />
          </View>
        ) : null}


        <View style={styles.FooterContainer}>
          <Text>Don’t have an account ?</Text>
          <Text style={{color: 'orange', fontWeight: '700'}}> SIGN UP</Text>
        </View>
      </View>
    </View>
  );
};

export default Captcha;

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#15579e',
  },
  SecondViewContainer: {
    backgroundColor: '#FFFFFF',
    margin: 10,
    borderRadius: 15,
  },
  MainLogo: {
    alignSelf: 'center',
    marginTop: 20,
  },
  InputTitleText: {
    backgroundColor: 'white',
    top: 15,
    marginLeft: 30,
    zIndex: 1,
    color: '#15579e',
    fontWeight: '500',
    fontSize: 15,
  },
  InputViewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 15,
    padding: 5,
    marginTop: 5,
    paddingRight: 15,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
  BaseContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 2,
    margin: 10,
    padding: 15,
    height: 120,
    width: 320,
  },
  SecondContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },
  ProtectedByText: {
    marginLeft: 15,
    paddingTop: 5,
  },
  PrivacyText: {
    fontSize: 10,
    paddingTop: 5,
    marginRight: 10,
  },
  HumanUserText: {
    color: 'blue',
    fontSize: 15,
    marginLeft: 20,
    padding: 3,
    top: -3,
  },
  SlideToVerifyText: {
    fontSize: 13,
    marginLeft: 23,
  },
  VerifiedView: {
    width: '70%',
    margin: 8,
    borderRadius: 100,
    padding: 5,
    backgroundColor: '#4d94c4',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  VerifiedText: {
    fontSize: 20,
    padding: 10,
    marginLeft: 50,
    textAlign: 'center',
    color: 'white',
  },
  SuccessView: {
    height: 50,
    width: 50,
    borderRadius: 100,
    backgroundColor: 'green',
  },
  RightText: {
    color: 'white',
    fontSize: 30,
    textAlign: 'center',
  },
  LoginButton: {
    margin: 10,
    marginTop: 25,
  },

  ModalMainContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 2,
    padding: 15,
  },
  CaptchaView: {
    backgroundColor: 'darkgray',
    height: 100,
    width: '85%',
  },
  TypeAllTheLetterText: {
    padding: 5,
    paddingTop: 20,
  },
  SelectLanguageText: {
    padding: 5,
  },
  InputCaptcha: {
    borderColor: '#000000',
    borderWidth: 1,
    width: '40%',
    marginTop: 20,
    height: 50,
    paddingLeft: 25,
    fontSize: 25,
  },
  FooterContainer: {
    padding: 20,
    backgroundColor: '#d9dbda',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
});
