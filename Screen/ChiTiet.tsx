import { ActivityIndicator, Alert, FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ImageLibraryOptions, ImagePickerResponse, OptionsCommon, launchImageLibrary } from 'react-native-image-picker';
import moment from 'moment-timezone';
import { HOST } from './config';
interface Props {
  navigation: any; // Adjust type as per your navigation prop
}
interface RouteParams {

      item?: {
        id: string;
        anh:string;
        anh1:string;
        anh2:string;
        anh3:string;
        ten:string;
        mota:string;
        gia:string;
        cpu:string;
        camera:string;
        pin:string;
        tinhtrang:string;
        
      },
      user?:{
        id:string,
        hoten:string,
        anh:string
      }
    
  
}
const convertImageToBase64 = async (uri: string): Promise<string | undefined> => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    return base64Data;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return undefined;
  }
};
const ChiTiet = (  {  route ,navigation }: { route: { params: RouteParams },  navigation: Props['navigation']  } ) => {
  const { item ,user} = route.params || {};

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [anhChinh,setAnhChinh] = useState(item?.anh)
    const [anh1, setAnh1] = useState(item?.anh1);
    const [anh2, setAnh2] = useState(item?.anh2);
    const [anh3, setAnh3] = useState(item?.anh3);
    const [ten, setTen] = useState(item?.ten);
    const [manhinh, setManHinh] = useState(item?.mota);
    const [gioHang, setGioHang] = useState([]);
    const rawPrice: string = item?.gia || '0';
    
    const parsedPrice = parseFloat(rawPrice); // Chuyển đổi giá từ chuỗi sang số

    const [cpu, setCpu] = useState(item?.cpu);
    const [camera, setCamera] = useState(item?.camera);
    const [pin, setPin] = useState(item?.pin);
    const tinhTrang: string = item?.tinhtrang ?? '';

    const [soLuong, setSoLuong] = useState(1); // Số lượng mặc định là 1
    const images = [anh1, anh2, anh3];
    const [thanhToan, setThanhToan] = useState<number>(0); // Khởi tạo thành toán với giá trị mặc định là 0

    const [hoTen,setHoten] = useState(user?.hoten)
    const [anh,setAnh] = useState(user?.anh)

    useEffect(() => {
      const giaMoi = Math.round(parsedPrice * (soLuong) * 1000) / 1000;
setThanhToan(giaMoi);
// Cập nhật giá khi số lượng thay đổi
    }, [soLuong]);
    const tang = () => {
      // Tăng số lượng sản phẩm nhưng không vượt quá tình trạng hiện có
      if (soLuong < parseInt(tinhTrang)) {
        setSoLuong(prevSoLuong => prevSoLuong + 1);
      }
    };
    
    const giam = () => {
      // Giảm số lượng sản phẩm nhưng không dưới 1
      if (soLuong > 1) {
        setSoLuong(prevSoLuong => prevSoLuong - 1);
      
      }
    };
    
    
    const onSwipeRight = () => {
      if (currentImageIndex < images.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
      }
    };
  
    const onSwipeLeft = () => {
      if (currentImageIndex > 0) {
        setCurrentImageIndex(currentImageIndex - 1);
      }
    };
    useEffect(() => {
        const interval = setInterval(() => {
          setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
        }, 2000); // Chuyển ảnh mỗi 3 giây
    
        return () => clearInterval(interval);
      }, []); // useEffect sẽ chỉ gọi một lần khi component được tạo
      const renderCurrentImageIndex = () => {
        return (
          <View style={styles.imageIndexContainer}>
            <Text style={styles.imageIndexText}>{currentImageIndex + 1}/{images.length}</Text>
          </View>
        );
      };

      const [selectedStarIndex, setSelectedStarIndex] = useState(-1); // Chỉ số của sao được chọn
   // Nội dung đánh giá của người dùng
      interface Index {
        index: number; // hoặc bạn có thể chỉ định kiểu dữ liệu chính xác của navigation
      }
      const handleStarPress = (index:Index) => {
        setSelectedStarIndex(index.index); // Cập nhật chỉ số của sao được chọn
      };
    
   
      const objDataGioHang ={ten:ten,anh:anhChinh,gia:rawPrice,soluong:soLuong};
      
      const getAddGioHang=()=>{
       fetch(`${HOST}/giohang`,{
        method:'POST',
        headers:{
          Accpet:"application/json",
          "Content-Type":"application/json"
        },
        body:JSON.stringify(objDataGioHang),
       })
       .then((res)=>{
        if(res.status===201){
          Alert.alert('Thêm Giỏ Hàng Thành Công')
        }
       })
       .catch((ex)=>{
        console.log(ex);
       })
      }
      React.useEffect(()=>{
        const unb = navigation.addListener('focus',()=>{
          getDanhGia();
        })
        return unb;
      },[navigation])
      const conFirmAddGioHang=()=>{
        Alert.alert(
          'Xác Nhận Thêm Giỏ Hàng',
          'Bạn Có Chắc Chắn Thêm Sản Phẩm Này Vào Giỏ Hàng Không?',
          [
            {text:'Hủy', style:'cancel'},
            {text:'Thêm Giỏ Hàng',onPress:getAddGioHang}
          ]
        )
      }
      const [dsdg, setDsdg] = useState([]);
      const [isloading, setIsLoading] = useState(true)
      const getDanhGia=async()=>{
        try {
          setIsLoading(true); 
          const response = await fetch(`${HOST}/danhgia`);
          const json = await response.json();
          setDsdg(json)
        } catch (error) {
          console.error(error);
        }finally{
          setIsLoading(false);
        }
      }
      interface Item {
        item:any;
      }
      const [imagess, setImagess] = useState<ImagePickerResponse['assets'] >([]);


      const [base64Images, setBase64Images] = useState<string[]>([]);
      const commonOptions: OptionsCommon = {
        mediaType: 'photo',
        maxWidth: 500,
        maxHeight: 500,
    };
    
    const libraryOptions: ImageLibraryOptions = {
        selectionLimit: 10,
        ...commonOptions
    };
    const onOpenLibrary = async () => {
        const response: ImagePickerResponse = await launchImageLibrary(
            libraryOptions,
        );
        if (response?.assets) {
            const newBase64Images = await Promise.all(
              response.assets.map(async (asset) => {
                const base64Image = await convertImageToBase64(asset.uri);
                return base64Image || '';
              })
            )
            setBase64Images(newBase64Images);
            setImagess(response.assets);
        } else {
            Alert.alert('Có lỗi xảy ra', response.errorMessage || 'Không có lỗi được thông báo');
        }
    };
    const [thoigian,setThoigian] = useState('')
    const [ndDanhGia, setNdDanhGia] = useState('')
    const guiDanhGia =()=>{
      
      const datetime = 
      moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm:ss')
      setThoigian(datetime)
    const objData ={hoten:hoTen,anhcanhan:anh,noidung:ndDanhGia,anhphanhoi:base64Images,thoigian:thoigian,soluongsao:currentImageIndex}

      fetch(`${HOST}/danhgia`,{
        method:"POST",
        headers:{
          Accept:"application/json",
          "Content-Type":"application/json"
        },
        body:JSON.stringify(objData)
      })
      .then((res)=>{
        if(res.status==201){
          Alert.alert('Gửi Đánh Giá Thành Công!')
          setNdDanhGia(''); // Reset nội dung đánh giá sau khi gửi
        setSelectedStarIndex(-1); // Reset số sao được chọn
        getDanhGia(); // Lấy lại danh sách đánh giá
        }
      })
      .catch((ex)=>{
        console.log(ex);
        
      })
    }
      const renderItem=({item}:Item)=>{
        return(
          <View style={styles.khung2}>
          <View style={{flexDirection:'row'}}>
          <Image source={item && item.anhcanhan &&item.anhcanhan[0]? {uri: item.anhcanhan[0]} : require('../Asset/b.jpg')}
            style={{width:60,height:60,borderRadius:30,marginTop:18,marginLeft:10}}></Image>
          <Text style={styles.txt11}>{item.hoten}</Text>
          </View>
          <Text style={{ color: '#4D9BDC', fontSize: 20 }}>{item.noidung}</Text>
         
          <View style={{ flexDirection: 'row' }}>
          {[1, 2, 3, 4, 5].map((_, index) => (
          <Image
            source={index < item.soluongsao ? require('../Asset/starvang.png') : require('../Asset/startrang.png')}
            style={{ width: 30, height: 30, margin: 5 }}
          />
          
      ))}

          </View>
          <Image source={item && item.anhphanhoi && item.anhphanhoi[0] ? {uri: item.anhphanhoi[0]} : require('../Asset/b.jpg')}
            style={{width:150,height:100,borderRadius:30,marginTop:10}}></Image>
          <Text style={{ color: '#61EE51', fontSize: 20 }}>{item.thoigian}</Text>

        </View>
        )
      }
      interface Index {
        index: number; // hoặc bạn có thể chỉ định kiểu dữ liệu chính xác của navigation
      }
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#4D9BDC'}}>
    
        <Image source={{uri: images[currentImageIndex]}} style={styles.img} />
        <TouchableOpacity onPress={onSwipeLeft}style={{position:'absolute',top:100}} >
            <Image source={require('../Asset/left1.png')} style={{width:50,height:50}}></Image>
      </TouchableOpacity>
      <TouchableOpacity onPress={onSwipeRight}style={{position:'absolute',top:100,right:0}} >
            <Image source={require('../Asset/right.png')} style={{width:50,height:50}}></Image>
      </TouchableOpacity>
      {renderCurrentImageIndex()}
      <ScrollView style={{marginLeft:20,marginRight:20,flex:1}}>

        <View style={styles.khung}>
            <Text style={styles.txt}>Chính Hãng</Text>
        </View>
        
        <Text style={styles.txt1}>{rawPrice}₫</Text>
        
        <Text style={styles.txt2}>Chi Tiết Sản Phẩm</Text>
        <View style={{height:4,width:'100%',backgroundColor:'#61EE51'}}></View>
        <Text style={styles.txt3}>Tên Sản Phẩm: {ten}</Text>
        <View style={{height:1,width:'100%',backgroundColor:'#FFF75A'}}></View>
        <Text style={styles.txt3}>Màn Hình: {manhinh}</Text>
        <View style={{height:1,width:'100%',backgroundColor:'#FFF75A'}}></View>
        <Text style={styles.txt3}>CPU: {cpu}</Text>
        <View style={{height:1,width:'100%',backgroundColor:'#FFF75A'}}></View>
        <Text style={styles.txt3}>Camera: {camera}</Text>
        <View style={{height:1,width:'100%',backgroundColor:'#FFF75A'}}></View>
        <Text style={styles.txt3}>Dung Lượng Pin: {pin}</Text>
        <View style={{height:1,width:'100%',backgroundColor:'#FFF75A'}}></View>
        <Text style={styles.txt3}>Tình Trạng: Còn {tinhTrang} Sản Phẩm</Text>
        <View style={{height:1,width:'100%',backgroundColor:'#FFF75A',marginBottom:20}}></View>
        <Text style={styles.txt2}>Đánh Giá Sản Phẩm</Text>
        <View style={{height:4,width:'100%',backgroundColor:'#61EE51'}}></View>
        <View style={{flexDirection:'row',width:'100%',paddingHorizontal:10,height:'auto',marginTop:10,borderWidth:2,borderColor:'white',backgroundColor:'#61EE51'}}>
          <View style={{flexDirection:'column'}}>
      <View style={{flexDirection:'row'}}>

      <TextInput placeholder='    Bạn Nghĩ Gì Về Sản Phẩm Này?'placeholderTextColor={'gray'} style={styles.inputDanhGia}
      onChangeText={txt=>setNdDanhGia(txt)}
         ></TextInput>
           <TouchableOpacity style={styles.btn3} onPress={guiDanhGia} >
        <Text style={styles.txt10}>Gửi Đánh Giá</Text>
      </TouchableOpacity>
</View>
      <View style={{flexDirection:'row'}}>
      {[1, 2, 3, 4, 5].map((_, index) => (
        
        <TouchableOpacity key={index} onPress={() => handleStarPress({index})}>
          <Image
            source={index <= selectedStarIndex ? require('../Asset/starvang.png') : require('../Asset/startrang.png')}
            style={{ width: 30, height: 30, margin: 5 }}
          />
        </TouchableOpacity>
      ))}
      
      </View>
      <View style={{flexDirection:'row',marginTop:10,marginBottom:10}}>
      <Text style={styles.txt12}>Thêm Ảnh Sản Phẩm➠ </Text>

        {imagess && imagess.map((image, index) => (
        
        <Image
            key={index}
            source={{ uri: image.uri }}
            style={styles.image}
            
        />
    ))}
           <TouchableOpacity style={styles.button} onPress={onOpenLibrary}>
                <Text style={styles.buttonText}>Mở Thư Viện</Text>
            </TouchableOpacity>
            </View>
      </View>
    

</View>
<View style={{marginTop:10,height:4,width:'100%',backgroundColor:'#61EE51'}}></View>
<Text style={styles.txt3}>Đánh Giá Phổ Biến </Text>
        <View style={{height:1,width:150,backgroundColor:'#FFF75A',marginBottom:10}}></View>
      {isloading?
      <ActivityIndicator></ActivityIndicator>:
        <FlatList
  data={dsdg}
  renderItem={ renderItem}
  keyExtractor={item => item.id}

></FlatList>
}

      </ScrollView>
      <View style={{marginLeft:10,marginBottom:20,marginRight:10}}>
      <View style={{flexDirection:'row',marginTop:10}}>
      <Text style={styles.txt4}>Đã chọn {soLuong} sản phẩm</Text>
      <Text style={styles.txt4}>Thanh Toán</Text>
      </View>
      <View style={{flexDirection:'row'}}>
        <TouchableOpacity style={styles.btn} onPress={giam}>
          <Text style={styles.txt5}>_</Text>
        </TouchableOpacity>
        <Text style={styles.txt7}>{soLuong}</Text>
        <TouchableOpacity style={styles.btn} onPress={tang}>
          <Text style={styles.txt6}>+</Text>
        </TouchableOpacity>
        <Text style={styles.txt8}>{thanhToan}0.000₫</Text>
</View>
<View style={{flexDirection:'row'}}>

      <TouchableOpacity style={styles.btn1} onPress={conFirmAddGioHang} >
      <Text style={styles.txt9}>Thêm Giỏ Hàng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn4 }onPress={()=>navigation.navigate('GioHang')}>
          <Image source={require('../Asset/giohang.png')} style={{width:80,height:60,position:'relative',right:6}}></Image>
        </TouchableOpacity>
</View>
        </View>
    </SafeAreaView>
  )
}

export default ChiTiet

const styles = StyleSheet.create({
    img:{width:'100%',height:250},
    txt:{color:'#E13E46'},
    txt1:{color:'#E13E46',fontSize:30},
    txt2:{color:'#61EE51',fontSize:20},
    txt3:{color:'#FFF75A',fontSize:18,marginTop:10},
    khung:{width:100,height:30,backgroundColor:'#FFF75A',alignItems:'center',justifyContent:'center',borderWidth:2,borderColor:'white',borderRadius:3,marginTop:10},
    imageIndexContainer: {
        position: 'absolute',
        top: 200,
        right: 180,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 5,
        borderRadius: 5,
      },
      imageIndexText: {
        color: 'white',
        fontSize: 16,
      },
      image: {
        width: 100,
        height: 40,
        resizeMode: 'cover',
        
      },
    txt4:{marginRight:215,fontSize:12,color:'#61EE51',marginBottom:5},
    btn:{borderWidth:2,width:30,height:30,borderColor:'white',backgroundColor:'#FFF75A',alignItems:'center',justifyContent:'center'},
    txt5:{color:'#61EE51',fontSize:40,fontWeight:'bold',position:'absolute',bottom:4},
    txt6:{color:'#61EE51',fontSize:40,fontWeight:'bold',position:'absolute',top:-17},
    txt7:{marginLeft:10,fontSize:30,position:'relative',bottom:5,marginRight:10,color:"#E13E46"},
    txt8:{color:'#E13E46',fontSize:30,position:'absolute',marginBottom:5,right:0},
    btn1:{borderWidth:2,width:310,marginTop:10,height:50,borderRadius:15,borderColor:'white',backgroundColor:'#FFF75A',alignItems:'center',justifyContent:'center'},
    txt9:{color:'#4D9BDC',fontWeight:'bold',fontSize:30},
    inputDanhGia:{borderWidth:2,borderColor:'#FFF75A',borderRadius:10,width:260,height:40,marginTop:10,backgroundColor:'#F3F3F1'},
    btn3:{width:80,height:45,backgroundColor:'#FCF4A4',borderRadius:20,position:'relative',left:10,top:7,borderWidth:2,borderColor:'white',justifyContent:'center',alignItems:'center'},
    btn4:{width:60,height:55,backgroundColor:'#FFF75A',borderRadius:30,position:'relative',left:15,top:7,borderWidth:2,borderColor:'white'},
    txt10:{fontSize:12,color:'#4D9BDC',fontWeight:'bold'},
    khung2:{width:370,height:'auto',marginBottom:5,backgroundColor:'#F3F3F1',padding:8,borderWidth:2,borderColor:'#FFF75A',borderRadius:10,alignItems:'center',marginRight:30,flex:1},
    txt11:{color:'#E13E46',fontSize:20,marginLeft:5,textAlignVertical:'center'},
    button: {
      backgroundColor: '#FCF4A4',
      borderRadius: 19,
      width:80,
      height:40,
      marginHorizontal:20,
      borderWidth:2,borderColor:'white',
      justifyContent:'center',
      alignItems:'center'
  },
  buttonText: {
      color: '#4D9BDC',
      fontSize: 10,
      fontWeight: 'bold',
  
  },
  txt12:{color:'#E13E46',textAlignVertical:'center'},
  
})