import React, { useEffect, useState } from 'react';
import { View, Button, Alert, Platform } from 'react-native';
import { LOG_LEVEL, Purchases } from 'react-native-purchases';

const PaymentScreen = () => {
  const [offerings, setOfferings] = useState(null);

  // Function to load offerings
  const loadOfferings = async () => {
    try {
      const offeringsData = await Purchases.getOfferings();
      if (offeringsData?.current?.availablePackages) {
        setOfferings(offeringsData.current.availablePackages);
        console.log("Offerings:", JSON.stringify(offeringsData.current.availablePackages));
      }
    } catch (error) {
      console.error("Error loading offerings:", error);
      Alert.alert("Error", "Failed to load offerings. Please try again.");
    }
  };

  // Effect hook to initialize configuration and load offerings
  useEffect(() => {
    const init = async () => {
      try {
        const APIKeys = {
          apple: 'your_apple_key',
          google: 'your_google_key'
        };
        await Purchases.configure({ apiKey: Platform.OS === 'android' ? APIKeys.google : APIKeys.apple });
        Purchases.setLogLevel(LOG_LEVEL.DEBUG);
        Purchases.addCustomerInfoUpdateListener((info) => console.log('Customer info updated:', info));
        await loadOfferings();
      } catch (error) {
        console.error("Initialization error:", error);
        Alert.alert("Error", "Failed to initialize the payment system. Please restart the app.");
      }
    };
    init();
  }, []);

  // Function to handle payment
  const handlePayment = async () => {
    if (!offerings) {
      Alert.alert("Error", "No offerings available. Please try again later.");
      return;
    }

    Alert.alert(
      "Confirm Purchase",
      "Are you sure you want to make this purchase?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => processPurchase() }
      ]
    );
  };

  const processPurchase = async () => {
    try {
      const productIdentifier = offerings[0].identifier; // Assuming we're using the first available package
      const purchaseResult = await Purchases.purchaseProduct(productIdentifier);
      console.log('Purchase Response:', purchaseResult);
      Alert.alert("Success", "Your purchase was successful!");
    } catch (error) {
      console.error('Payment Error:', error);
      Alert.alert("Purchase Failed", error.message || "An error occurred during the purchase. Please try again.");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Make Payment" onPress={handlePayment} disabled={!offerings} />
    </View>
  );
};

export default PaymentScreen;