import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const QA = () => {
  const [showText, setShowText] = useState(false);

  const toggleText = () => {
    setShowText(!showText);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#4D9BDC', padding: 20 }}>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.txt}>Tại sao sản phẩm của shop lại được bán chạy nhất thế giới?</Text>
        <TouchableOpacity onPress={toggleText}>
          <Image source={showText ? require('../Asset/up.png') : require('../Asset/down.png')} style={{ width: 30, height: 30 }} />
        </TouchableOpacity>
      </View>
      {showText && (
        <Text style={styles.txt1}>
          Sản phẩm của shop là sản phẩm được chắt lọc kỹ càng thông qua khâu kiểm tra khắt khe và nguyên liệu cực chất lượng đi kèm với đó là một xưởng + đội ngũ nhân viên xịn xò nhất thế giới.
        </Text>
      )}
    </SafeAreaView>
  );
};

export default QA;

const styles = StyleSheet.create({
  txt: { fontSize: 20, color: '#E13E46', width: 350 },
  txt1: { fontSize: 19, fontWeight: '200', color: '#61EE51', marginTop: 20 },
});
