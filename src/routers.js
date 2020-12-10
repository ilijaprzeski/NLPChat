import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation'
import {
    SplashScreen,
    LoginScreen,
    SignupScreen,
    HomeScreen,
    ChatRoomScreen,
    LearnScreen,
    ProfileScreen,
    ReportScreen,
    InfoScreen,
    SettingScreen,
    ChattingScreen,
    WordsMatterScreen,
    TermsConditionsScreen,
    PrivacyPolicyScreen,
    AboutUsScreen,
    SocialLinksScreen,
    ContactsScreen,
    SearchContactScreen,
    SearchMessageScreen,
    ForgotPasswordScreen
} from './screens'

const SignNavigator = createStackNavigator({
    signin: {screen: LoginScreen},
    signup: {screen: SignupScreen},
    termscondition: {screen: TermsConditionsScreen},
    policy: {screen: PrivacyPolicyScreen},
    forgotpassword: {screen: ForgotPasswordScreen}
}, {
    initialRouteName: 'signin',
    headerMode: 'none'
})

const MainNavigator = createStackNavigator({
    home: {screen: HomeScreen},

    chatroom: {screen: ChatRoomScreen},
    addressbook: {screen: ContactsScreen},
    searchcontact: {screen: SearchContactScreen},
    searchmessage: {screen: SearchMessageScreen},
    chatting: {screen: ChattingScreen},
    wordsmatter: {screen: WordsMatterScreen},

    learn: {screen: LearnScreen},

    profile: {screen: ProfileScreen},

    report: {screen: ReportScreen},

    info: {screen: InfoScreen},
    terms: {screen: TermsConditionsScreen},
    privacypolicy: {screen: PrivacyPolicyScreen},
    aboutus: {screen: AboutUsScreen},
    social: {screen: SocialLinksScreen},

    setting: {screen: SettingScreen},
}, {
    initialRouteName: 'home',
    headerMode: 'none'
})

const MainSwitchNavigator = createSwitchNavigator({
    splash: SplashScreen,
    sign: SignNavigator,
    main: MainNavigator
}, {
    initialRouteName: 'splash'
})

export default AppContainer = createAppContainer(MainSwitchNavigator)