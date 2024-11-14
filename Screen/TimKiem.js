import React, { useState, useEffect } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HOST } from './config';

const TimKiem = (props) => {
  const [sp, setSp] = useState([]);
  const [spSpSale, setSpSale] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    // Fetch data from API endpoints
    const fetchData = async () => {
      try {
        const responseSp = await fetch(`${HOST}/sanpham`);
        const dataSp = await responseSp.json();
        setSp(dataSp);

        const responseSpSale = await fetch(`${HOST}/sanphamsale`);
        const dataSpSale = await responseSpSale.json();
        setSpSale(dataSpSale);
      } catch (error) {
        console.log(error);
      } 
    };
    fetchData();
  }, []);
  const searchProduct = () => {
    const lowerCaseSearchKeyword = searchKeyword.toLowerCase();
    const filteredSp = sp.filter(item => item.ten.toLowerCase().includes(lowerCaseSearchKeyword));
    const filteredSpSale = spSpSale.filter(item => item.ten.toLowerCase().includes(lowerCaseSearchKeyword));
    setSearchResult([...filteredSp, ...filteredSpSale]);
    setSearchKeyword('');
  };
  


  const renderItem = ({ item }) => {
    return (

      <ScrollView style={{ flex: 1, marginTop: 20 }}>
        <TouchableOpacity onPress={()=>props.navigation.navigate('ChiTiet',{item:item})}> 
        <View style={styles.khung}>
          <Image source={{ uri: item.anh }} style={{ width: 90, height: 90 }} />
          <View style={{ flexDirection: 'column', marginLeft: 10 }}>
            <Text style={styles.txt}>{item.ten}</Text>
            <Text style={styles.txt1}>{item.gia}</Text>
            <Text style={styles.txt2}>Còn {item.tinhtrang} Sản Phẩm</Text>
          </View>
        </View>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#4D9BDC', padding: 20 }}>
      <View style={{ flexDirection: 'row' }}>
        <TextInput
          placeholder="Nhập Nội Dung Tìm Kiếm"
          placeholderTextColor="gray"
          style={styles.input}
          value={searchKeyword}
          onChangeText={text => setSearchKeyword(text)}
        />
        <TouchableOpacity onPress={searchProduct}>
          <Image source={require('../Asset/search.png')} style={styles.img} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={searchResult}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
};

export default TimKiem;

const styles = StyleSheet.create({
  input: { width: 330, height: 50, backgroundColor: '#F3F3F1', borderWidth: 2, borderColor: 'gray', borderRadius: 10 },
  img: { width: 50, height: 50 },
  khung: { width: 370, height: 120, backgroundColor: '#F3F3F1', borderWidth: 2, borderColor: '#FFF75A', borderRadius: 10, paddingLeft: 10, flexDirection: 'row', paddingTop: 10 },
  txt: { color: '#4D9BDC', fontSize: 23 },
  txt1: { color: '#E13E46', fontSize: 20 },
  txt2: { color: '#61EE51', fontSize: 17 },
});
