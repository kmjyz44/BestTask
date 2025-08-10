
import React, { useRef, useEffect, useState } from 'react'
import { SafeAreaView, Platform, BackHandler } from 'react-native'
import { WebView } from 'react-native-webview'
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'

// Base site URL (your deployed web app, e.g., https://besttask.vercel.app)
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || 'http://10.0.2.2:3000'

export default function App() {
  const ref = useRef(null)
  const [canGoBack, setCanGoBack] = useState(false)

  // Handle hardware back button on Android
  useEffect(() => {
    if (Platform.OS !== 'android') return
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack && ref.current) {
        ref.current.goBack()
        return true
      }
      return false
    })
    return () => sub.remove()
  }, [canGoBack])

  // Deep links (besttask://path)
  const prefix = Linking.createURL('/')
  useEffect(() => {
    const sub = Linking.addEventListener('url', ({ url }) => {
      if (ref.current && url) {
        const path = url.replace(prefix, '')
        ref.current.injectJavaScript(`window.location.href='${BASE_URL}/${path}'; true;`)
      }
    })
    return () => sub.remove()
  }, [])

  // Open external links in system browser
  const onShouldStartLoadWithRequest = (req) => {
    const isSameOrigin = req.url.startsWith(BASE_URL)
    if (!isSameOrigin && (req.navigationType === 'click' || req.target === '_blank')) {
      WebBrowser.openBrowserAsync(req.url)
      return false
    }
    return true
  }

  return (
    <SafeAreaView style={{flex:1}}>
      <WebView
        ref={ref}
        source={{ uri: BASE_URL }}
        onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
        setSupportMultipleWindows={false}
        startInLoadingState
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={['*']}
        allowsBackForwardNavigationGestures
        pullToRefreshEnabled
      />
    </SafeAreaView>
  )
}
