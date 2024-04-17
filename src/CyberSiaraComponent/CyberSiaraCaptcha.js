import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import DropDownPicker from 'react-native-dropdown-picker';
import { SkypeIndicator } from 'react-native-indicators';
import Modal from 'react-native-modal';
import { NetworkInfo } from 'react-native-network-info';
import Slider from 'react-native-slide-to-unlock';

const CyberSiaraCaptcha = (props) => {
  const {isLogin , PUBLIC_KEY , PRIVATE_KEY} = props;
  const {width, height} = Dimensions.get('window');

  const [visible, setVisible] = useState(false);
  const [captchaShow, setCaptchaShow] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);

  const [captchaSolve, setCaptchaSolve] = useState(false);
  const [visiterId, setVisiterId] = useState();

  const [captchaText, setCaptchaText] = useState('');

  const [captcha, setCaptcha] = useState();

  const [submitApiData, setSubmitApiData] = useState([]);
  const [verifiedCaptchaData, setVerifiedCaptchaData] = useState([]);
  const [indicator, setIndicator] = useState(false);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [user_type, setuser_type] = useState([
    {label: 'English', value: 'English'},
    {label: 'Hindi', value: 'Hindi'},
  ]);

  const [state, setState] = useState({
    DeviceIp: '',
    DeviceType: '',
    DeviceName: '',
    UniqueID: '',
    PackageName: '',
  });

  const {DeviceIp, DeviceType, DeviceName, UniqueID, PackageName} = state;
  console.log();
  console.log(state);
  const _onChangeText = (key, val) => {
    setState(state => ({...state, [key]: val}));
  };

  useEffect(() => {
    if (Platform.OS == 'android') {
      _onChangeText('DeviceType', 'Android');
    } else {
      _onChangeText('DeviceType', 'Ios');
    }
  }, []);

  useEffect(() => {
    GetDeviceInfo();
  }, []);

  const GetDeviceInfo = async () => {
    NetworkInfo.getIPAddress().then(ipAddress => {
      _onChangeText('DeviceIp', ipAddress);
    });

    DeviceInfo.getManufacturer().then(deviceName => {
      _onChangeText('DeviceName', deviceName);
    });

    const uniqueId = await DeviceInfo.getUniqueId();
    _onChangeText('UniqueID', uniqueId);
    console.log(uniqueId);

    let bundleId = DeviceInfo.getBundleId();
    console.log('111111111111', bundleId);
    _onChangeText('PackageName', bundleId);
  };

  useEffect(() => {
    Captcha();
  }, [state]);

  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const Captcha = async () => {
    setIndicator(true);

    var raw = JSON.stringify({
      MasterUrlId: PUBLIC_KEY,
      RequestUrl: PackageName+'.com',
      BrowserIdentity: UniqueID,
      DeviceIp: DeviceIp,
      DeviceType: DeviceType,
      DeviceBrowser: 'Chrome',
      DeviceName: DeviceName,
      DeviceHeight: Math.round(height),
      DeviceWidth: Math.round(width),
    });
    console.log('1 Api Data Pass ------ ', raw);
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };
    await fetch(
      'https://embed.mycybersiara.com/api/CyberSiara/GetCyberSiaraForAndroid',
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        setIndicator(false);
        console.log('1 APi Response -=-=-=- ', result?.Message);
        setVisiterId(result);
      })
      .catch(error => {
        setIndicator(false);
        console.log('error 1', error);
      });
  };

  const VerifiedSubmit = async () => {
    var raw = JSON.stringify({
      MasterUrl: PUBLIC_KEY,
      DeviceIp: DeviceIp,
      DeviceName: DeviceName,
      BrowserIdentity: UniqueID,
      Protocol: 'http',
      second: '5',
      RequestID: visiterId?.RequestId,
      VisiterId: visiterId?.Visiter_Id,
    });
    console.log('2 APi Data Pass ------', raw);
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    await fetch(
      'https://embed.mycybersiara.com/api/SubmitCaptcha/VerifiedSubmitForAndroid',
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        setSubmitApiData(result);
        console.log('2 Api Response -=-=-=- ', result, result?.Message);
        if (result.Message == 'success') {
          setVisible(true);
          props.loginVisible(true);
          setCaptchaSolve(true);
          setIndicator(false);
          Refresh();
        } else {
          setVisible(false);
          props.loginVisible(false);
          setCaptchaSolve(false);
          setCaptchaShow(true);
          setIndicator(false);
          GenerateCaptcha();
        }
      })
      .catch(error => {
        setVisible(false);
        setIndicator(false);
        console.log('error 2', error);
      });
  };

  const GenerateCaptcha = () => {
    setIndicator(true);

    var raw = JSON.stringify({
      MasterUrlId: PUBLIC_KEY,
      RequestUrl: PackageName+'.com',
      BrowserIdentity: UniqueID,
      DeviceIp: DeviceIp,
      DeviceType: DeviceType,
      DeviceBrowser: 'unknown',
      DeviceName: DeviceName,
      DeviceHeight: Math.round(height),
      DeviceWidth: Math.round(width),
      VisiterId: visiterId?.Visiter_Id,
    });
    console.log('3 Api Data Pass', raw);
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(
      'https://embed.mycybersiara.com/api/GenerateCaptcha/CaptchaForAndroid',
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        setIndicator(false);
        setCaptcha(result);
        console.log('3 Api Response -=-=-=- ', result);
      })
      .catch(error => {
        setIndicator(false);
        console.log('error 3', error);
      });
  };

  const SubmitCaptcha = data => {
    setCaptchaText(data);
    if (captchaText.length == 5 - 1) {
      setIndicator(true);
      var raw = JSON.stringify({
        MasterUrl: PUBLIC_KEY,
        DeviceIp: DeviceIp,
        DeviceType: DeviceType,
        DeviceName: DeviceName,
        UserCaptcha: captchaText,
        ByPass: 'Netural',
        BrowserIdentity: UniqueID,
        Timespent: '24',
        Protocol: 'http',
        Flag: '1',
        second: '2',
        RequestID: visiterId?.RequestId,
        VisiterId: visiterId?.Visiter_Id,
        fillupsecond: '8',
      });

      console.log('4 Api Data Pass ------ ', raw);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      fetch(
        'https://embed.mycybersiara.com/api/SubmitCaptcha/SubmitCaptchInfoForAndroid',
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          console.log('4 Api Response -=-=-=-=-= ', result);
          setVerifiedCaptchaData(result);
          setIndicator(false);
          if (result?.Message == 'success') {
            setCaptchaShow(false);
            setVisible(true);
            setCaptchaSolve(true);
            props.loginVisible(true);
            Refresh();
          } else {
            setCaptchaText('');
            GenerateCaptcha();
          }
        })
        .catch(error => {
          setIndicator(false);
          console.log('error 4', error);
        });
    }
  };

  const Refresh = () => {
    setTimeout(() => {
      setVisible(false);
      props.loginVisible(false);
      setCaptchaSolve(false);
      setVisible(false);
    }, 30000);
  };

  return (
    <View>
      <View style={styles.BaseContainer}>
        <View style={styles.SecondContainer}>
          {!visible ? (
            <Slider
              onEndReached={() => {
                VerifiedSubmit();
                setVisible(true);
              }}
              containerStyle={{
                margin: 8,
                backgroundColor: 'lightgray',
                borderRadius: 100,
                overflow: 'hidden',
                alignItems: 'center',
                justifyContent: 'center',
                width: '70%',
              }}
              sliderElement={
                <Image
                  style={{
                    width: 50,
                    margin: 4,
                    borderRadius: 100,
                    height: 50,
                    borderWidth: 5,
                    borderColor: 'white',
                    backgroundColor: 'red',
                  }}
                  source={require('./Images/slideArrow.png')}
                />
              }
            >
              <View>
                <Text style={styles.HumanUserText}>Human User ?</Text>
                <Text style={styles.SlideToVerifyText}>Slide to Verify</Text>
              </View>
            </Slider>
          ) : captchaSolve ? (
            <View style={styles.VerifiedView}>
              <Text style={styles.VerifiedText}>Verified</Text>
              <Image
                style={{
                  width: 50,
                  margin: 4,
                  borderRadius: 100,
                  height: 50,
                }}
                source={require('./Images/RightCaptcha.gif')}
              />
            </View>
          ) : (
            <View
              style={[
                styles.VerifiedView,
                {backgroundColor: 'lightgray', padding: 0},
              ]}
            >
              <View>
                <Text
                  style={[
                    styles.HumanUserText,
                    {marginLeft: 55, paddingTop: 11.5},
                  ]}
                >
                  Human User ?
                </Text>
                <Text style={[styles.SlideToVerifyText, {marginLeft: 57}]}>
                  Slide to Verify
                </Text>
              </View>
              <Image
                style={{
                  width: 50,
                  margin: 4,
                  borderRadius: 100,
                  height: 50,
                  borderWidth: 5,
                  borderColor: 'white',
                  backgroundColor: 'red',
                }}
                source={require('./Images/slideArrow.png')}
              />
            </View>
          )}
          <View>
            <Image
              style={{
                width: 60,
                margin: 4,
                marginTop: 10,
                borderRadius: 100,
                height: 60,
              }}
              source={require('./Images/download.png')}
            />
          </View>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.ProtectedByText}>Protected by CyberSiARA</Text>
          <Text style={styles.PrivacyText}>Privacy Terms</Text>
        </View>

        <View>
          <Modal backdropOpacity={0} isVisible={captchaShow}>
            <View style={styles.ModalMainContainer}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Image
                  style={{
                    width: 40,
                    margin: 4,
                    marginTop: 10,
                    borderRadius: 100,
                    height: 40,
                  }}
                  source={require('./Images/download.png')}
                />
                <TouchableOpacity
                  onPress={() => setCaptchaShow(false) || setVisible(false)}
                >
                  <Image
                    source={require('./Images/close.png')}
                    style={{marginTop: 20, padding: 5, height: 15, width: 15}}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.SelectLanguageText}>
                Please Select Language
              </Text>
              <View>
                <DropDownPicker
                  dropDownDirection={'BOTTOM'}
                  style={styles.SelectLanguage}
                  placeholder={'Select Language'}
                  placeholderStyle={{
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                  theme="DARK"
                  showTickIcon={true}
                  open={open}
                  value={value}
                  items={user_type}
                  flatListProps={true}
                  setOpen={setOpen}
                  setValue={setValue}
                  setItems={setuser_type}
                />
              </View>
              <View>
                <Text style={styles.TypeAllTheLetterText}>
                  Type all the displayed letters
                </Text>

                <View style={{flexDirection: 'row'}}>
                  <View style={styles.CaptchaView}>
                    <View style={{backgroundColor: 'red', top: 35}}>
                      <SkypeIndicator color={'black'} size={25} />
                    </View>
                    <Image
                      source={{
                        uri: captcha?.HtmlFormate,
                      }}
                      style={{width: 260, height: 65}}
                    />
                  </View>
                  <TouchableOpacity onPress={() => GenerateCaptcha()}>
                    <Image
                      source={require('./Images/refresh-page-option.png')}
                      style={{
                        margin: 10,
                        padding: 1,
                        marginTop: 20,
                        height: 20,
                        width: 20,
                      }}
                    />
                  </TouchableOpacity>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <TextInput
                    style={styles.InputCaptcha}
                    maxLength={4}
                    value={captchaText}
                    onChangeText={text => SubmitCaptcha(text)}
                    secureTextEntry={caseSensitive}
                    onSubmitEditing={() => SubmitCaptcha()}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingTop: 25,
                      paddingLeft: 10,
                    }}
                  >
                    <Text style={{paddingTop: 10}}>Not Case Sensitive</Text>

                    {caseSensitive ? (
                      <TouchableOpacity onPress={() => setCaseSensitive(false)}>
                        <Image
                          source={require('./Images/view.png')}
                          style={{
                            marginLeft: 10,
                            padding: 5,
                            height: 23,
                            width: 23,
                            marginTop: 8,
                          }}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={() => setCaseSensitive(true)}>
                        <Image
                          source={require('./Images/hide.png')}
                          style={{
                            marginLeft: 10,
                            padding: 5,
                            height: 23,
                            width: 23,
                            marginTop: 8,
                          }}
                        />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity>
                      <Image
                        source={require('./Images/dots.png')}
                        style={{
                          padding: 5,
                          paddingTop: 10,
                          height: 20,
                          width: 20,
                          marginTop: 8,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={{justifyContent: 'center'}}>
                <Text
                  style={{textAlign: 'center', marginTop: 20, fontSize: 10}}
                >
                  Protected by CyberSIARA @
                </Text>
                <Text style={{textAlign: 'center', fontSize: 10}}>
                  Privacy - Teams
                </Text>
              </View>
            </View>
          </Modal>
        </View>
        {indicator ? (
          <Modal visible={indicator} transparent={true} style={{margin: 0}}>
            <View style={{flex: 1, backgroundColor: '#4E4E4E80'}}>
              <SkypeIndicator color={'lightgray'} size={40} />
            </View>
          </Modal>
        ) : null}
      </View>
    </View>
  );
};
export default CyberSiaraCaptcha;

const styles = StyleSheet.create({
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
    backgroundColor: '#4d94c4',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  VerifiedText: {
    fontSize: 20,
    padding: 15,
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
    width: '88%',
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
    paddingLeft: 30,
    fontSize: 25,
  },
});
