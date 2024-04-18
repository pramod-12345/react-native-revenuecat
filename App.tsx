// Import necessary libraries
import React, { useEffect } from 'react';
import { View, Button, Alert, Platform } from 'react-native';
import { LOG_LEVEL, Purchases } from 'react-native-purchases';

const PaymentScreen = () => {

  // Function to load offerings
  const loadOfferings = async () => {
    //AsyncStorage.clear()
    const offerings = await Purchases.getOfferings();
    if (offerings?.current?.availablePackages) {
      console.log("Offerings: " + JSON.stringify(offerings.current.availablePackages))
    }
  };

  // Effect hook to initialize configuration and load offerings
  useEffect(() => {
    const init = async () => {
      const APIKeys = {
        apple: 'your_apple_key',
        google: 'your_google_key'
      };
      if (Platform.OS === 'android') {
        await Purchases.configure({ apiKey: APIKeys.google });
      } else {
        await Purchases.configure({ apiKey: APIKeys.apple });
      }

      // Set log level to DEBUG
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);

      // Listen for customer updates
      Purchases.addCustomerInfoUpdateListener(async (info) => {
        console.log(' ------> info', info)
      });

      // Load all offerings and the user object with entitlements
      await loadOfferings();
    };
    init();
  }, []);

  // Function to handle payment
  const handlePayment = async () => {
    let productidentifier = 'PRODUCT_IDENTIFIER'; // ID for the product mentioned in app stores

    // Purchase the product
    Purchases.purchaseProduct(productidentifier, null, Purchases.PRODUCT_CATEGORY.SUBSCRIPTION)
      .then((resp) => {
        console.log(' --Payment Response----> ', resp);
        Alert.alert('Purchase successful');
      })
      .catch((error) => {
        console.log(' ---Payment Error---> ', error);
        Alert.alert('Purchase failed');
      });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Make Payment" onPress={handlePayment} />
    </View>
  );
};

export default PaymentScreen;