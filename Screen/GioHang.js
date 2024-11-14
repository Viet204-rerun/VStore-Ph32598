import { ActivityIndicator, Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CheckBox from '@react-native-community/checkbox';
import { HOST } from './config';

const GioHang = (props) => {
  const [thanhToan, setThanhToan] = useState(0);
  const [gioHang, setGioHang] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const tinhTrang = 10;

  const calculateTotalPrice = (updatedGioHang) => {
    const total = updatedGioHang
      .filter((item) => item.selected)
      .reduce((acc, item) => acc + (parseFloat(item.gia) * item.soluong * 1000000), 0);
    setThanhToan(total);
  };

  const tang = (index) => {
    const updatedGioHang = [...gioHang];
    if (updatedGioHang[index].soluong < parseInt(tinhTrang)) {
      updatedGioHang[index].soluong += 1;
      setGioHang(updatedGioHang);
      calculateTotalPrice(updatedGioHang);
    }
  };

  const giam = (index) => {
    const updatedGioHang = [...gioHang];
    if (updatedGioHang[index].soluong > 1) {
      updatedGioHang[index].soluong -= 1;
      setGioHang(updatedGioHang);
      calculateTotalPrice(updatedGioHang);
    }
  };

  const getGioHang = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${HOST}/giohang`);
      const json = await response.json();
      setGioHang(json);
      calculateTotalPrice(json);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unb = props.navigation.addListener('focus', () => {
      getGioHang();
    });
    return unb;
  }, [props.navigation]);

  const handleCheckBoxChange = (index) => {
    const updatedGioHang = gioHang.map((item, i) => {
      if (i === index) {
        return { ...item, selected: !item.selected };
      }
      return item;
    });
    setGioHang(updatedGioHang);
    calculateTotalPrice(updatedGioHang);
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const res = await fetch(`${HOST}/giohang/` + itemId, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (res.status === 200) {
        Alert.alert('Đã Xóa Khỏi Giỏ Hàng!');
        const updatedGioHang = gioHang.filter((item) => item.id !== itemId);
        setGioHang(updatedGioHang); // Cập nhật giỏ hàng ngay lập tức sau khi xóa
        calculateTotalPrice(updatedGioHang);
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  const renderItem = ({ item, index }) => {
    const conFirmXoa = () => {
      Alert.alert(
        'Đang Thực Hiện Thao Tác Xóa ',
        'Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng không?',
        [
          { text: 'Hủy', style: 'cancel' },
          { text: 'Xóa', onPress: () => handleDeleteItem(item.id) }
        ]
      );
    };

    return (
      <View style={styles.khung}>
        <CheckBox
          style={{ marginTop: 30, marginRight: 10 }}
          value={item.selected}
          onValueChange={() => handleCheckBoxChange(index)}
        />
        <Image source={{ uri: item.anh }} style={{ width: 90, height: 90 }} />
        <View style={{ flexDirection: 'column', marginLeft: 10, marginHorizontal: 10, width: 210 }}>
          <Text style={styles.txt}>{item.ten}</Text>
          <Text style={styles.txt1}>{(parseFloat(item.gia) * item.soluong * 1000000).toLocaleString()}₫</Text>
          <View style={{ flexDirection: 'row', position: 'absolute', bottom: 10 }}>
            <TouchableOpacity style={styles.btn} onPress={() => giam(index)}>
              <Text style={styles.txt5}>_</Text>
            </TouchableOpacity>
            <Text style={styles.txt7}>{item.soluong}</Text>
            <TouchableOpacity style={styles.btn} onPress={() => tang(index)}>
              <Text style={styles.txt6}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={conFirmXoa}>
              <Image source={require('../Asset/xoa.png')} style={{ width: 20, height: 20, resizeMode: 'center', marginLeft: 30 }} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#4D9BDC', padding: 20 }}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={gioHang}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          extraData={gioHang} // Đảm bảo `FlatList` cập nhật lại khi `gioHang` thay đổi
        />
      )}
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.txt4}>Thanh Toán</Text>
        <Text style={styles.txt8}>{thanhToan.toLocaleString()}₫</Text>
      </View>
      <TouchableOpacity style={styles.btnThanhToan} onPress={() => props.navigation.navigate('ThanhToan', { gioHangChon: gioHang.filter(item => item.selected), thanhtoan: thanhToan })}>
        <Text style={styles.txt9}>Tiến hành thanh toán ➠</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default GioHang;

const styles = StyleSheet.create({
  txt: { color: '#4D9BDC', fontSize: 20, position: 'absolute', top: -8 },
  txt1: { color: '#E13E46', fontSize: 18, position: 'absolute', bottom: 45 },
  khung: { width: 370, height: 120, backgroundColor: '#F3F3F1', borderWidth: 2, borderColor: '#FFF75A', borderRadius: 10, paddingLeft: 10, flexDirection: 'row', paddingTop: 10, paddingRight: 10 },
  txt5: { color: '#61EE51', fontSize: 30, fontWeight: 'bold', position: 'absolute', bottom: 1 },
  txt6: { color: '#61EE51', fontSize: 30, fontWeight: 'bold', position: 'absolute', bottom: -10 },
  txt7: { marginLeft: 10, fontSize: 20, position: 'relative', bottom: 4, marginRight: 10, color: '#E13E46' },
  txt8: { color: '#E13E46', fontSize: 30, position: 'absolute', right: 0 },
  btn: { borderWidth: 2, width: 20, height: 20, borderColor: 'white', backgroundColor: '#FFF75A', alignItems: 'center', justifyContent: 'center' },
  txt4: { fontSize: 20, color: '#61EE51', marginBottom: 5, position: 'relative', top: 8 },
  btnThanhToan: { width: '100%', height: 50, backgroundColor: '#FFF75A', justifyContent: 'center', paddingLeft: 25, marginTop: 20, borderRadius: 10, borderWidth: 4, borderColor: 'white' },
  txt9: { fontSize: 20, color: '#4D9BDC' }
});
