import { useState } from "react"
import Colors from '@/constants/Colors';
import { useOAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { View, StyleSheet, TextInput, Text, TouchableOpacity } from 'react-native';
import { defaultStyles } from '@/constants/Styles';
import { useWarmUpBrowser } from '@/hooks/useWarmpUpBrowser';
import { useSignIn } from "@clerk/clerk-expo";

enum Strategy {
    Google = 'oauth_google',
    Apple = 'oauth_apple',
    Facebook = 'oauth_facebook',
}
const Page = () => {
    useWarmUpBrowser();

    const router = useRouter();
    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const { signIn, setActive, isLoaded } = useSignIn();

    const { startOAuthFlow: googleAuth } = useOAuth({ strategy: 'oauth_google' });
    const { startOAuthFlow: appleAuth } = useOAuth({ strategy: 'oauth_apple' });
    const { startOAuthFlow: facebookAuth } = useOAuth({ strategy: 'oauth_facebook' });

    const onSelectAuth = async (strategy: Strategy) => {
        try {
            let authProvider;
            switch (strategy) {
                case Strategy.Google:
                    authProvider = googleAuth;
                    break;
                case Strategy.Apple:
                    authProvider = appleAuth;
                    break;
                case Strategy.Facebook:
                    authProvider = facebookAuth;
                    break;
                default:
                    throw new Error('Invalid authentication strategy');
            }

            console.log("Authenticating with", strategy);
            const authResult = await authProvider!();

            if (authResult && authResult?.createdSessionId) {
                console.log('Authentication successful:', authResult.createdSessionId);
                // setActive!({ session: authResult.createdSessionId });
                // router.back();
            } else {
                console.error('Authentication failed: Unexpected result', authResult);
            }
        } catch (err) {
            console.error('Authentication error:', err);
        }
    };


    const onSignInPress = async () => {
        if (!isLoaded) {
            return;
        }

        console.log("Clickiing")

        try {
            const completeSignIn = await signIn.create({
                identifier: emailAddress,
                password,
            });
            // This is an important step,
            // This indicates the user is signed in
            await setActive({ session: completeSignIn.createdSessionId });
            router.back();
        } catch (err: any) {
            console.log(err);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                autoCapitalize="none"
                value={emailAddress}
                placeholder="Email..."
                onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                style={[defaultStyles.inputField, { marginBottom: 30 }]}
            />

            <TextInput
                value={password}
                placeholder="Password..."
                secureTextEntry={true}
                onChangeText={(password) => setPassword(password)}
                style={[defaultStyles.inputField, { marginBottom: 30 }]}
            />



            <TouchableOpacity style={defaultStyles.btn} onPress={() => onSignInPress()}>
                <Text style={defaultStyles.btnText}>Continue</Text>
            </TouchableOpacity>

            <View style={styles.seperatorView}>
                <View
                    style={{
                        flex: 1,
                        borderBottomColor: 'black',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                    }}
                />
                <Text style={styles.seperator}>or</Text>
                <View
                    style={{
                        flex: 1,
                        borderBottomColor: 'black',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                    }}
                />
            </View>

            <View style={{ gap: 20 }}>
                <TouchableOpacity style={styles.btnOutline}>
                    <Ionicons name="mail-outline" size={24} style={defaultStyles.btnIcon} />
                    <Text style={styles.btnOutlineText}>Continue with Phone</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnOutline} onPress={() => onSelectAuth(Strategy.Apple)}>
                    <Ionicons name="md-logo-apple" size={24} style={defaultStyles.btnIcon} />
                    <Text style={styles.btnOutlineText}>Continue with Apple</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnOutline} onPress={() => onSelectAuth(Strategy.Google)}>
                    <Ionicons name="md-logo-google" size={24} style={defaultStyles.btnIcon} />
                    <Text style={styles.btnOutlineText}>Continue with Google</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnOutline} onPress={() => onSelectAuth(Strategy.Facebook)}>
                    <Ionicons name="md-logo-facebook" size={24} style={defaultStyles.btnIcon} />
                    <Text style={styles.btnOutlineText}>Continue with Facebook</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Page;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 26,
    },

    seperatorView: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        marginVertical: 30,
    },
    seperator: {
        fontFamily: 'mon-sb',
        color: Colors.grey,
        fontSize: 16,
    },
    btnOutline: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: Colors.grey,
        height: 50,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
    },
    btnOutlineText: {
        color: '#000',
        fontSize: 16,
        fontFamily: 'mon-sb',
    },
});