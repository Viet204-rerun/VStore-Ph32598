import React from 'react';
import { Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ManHinhChao from './Screen/ManHinhChao';
import DangNhap from './Screen/DangNhap';
import DangKy from './Screen/DangKy';
import ManHinhChinh from './Screen/ManHinhChinh';
import ChiTiet from './Screen/ChiTiet';
import TimKiem from './Screen/TimKiem';
import ThongBao from './Screen/ThongBao';
import GioHang from './Screen/GioHang';
import ThanhToan from './Screen/ThanhToan';
import LichSu from './Screen/LichSu';
import CaNhan from './Screen/CaNhan';
import ChinhSua from './Screen/ChinhSua';
import QA from './Screen/QA';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
interface TabNavigatorProps {
  route: {
    params?: {
      userId?: string;
    };
  };
}

const TabNavigator = ({ route }: TabNavigatorProps) => {
  const userId = route.params?.userId ?? '';

  return (
    <Tab.Navigator initialRouteName='Home' screenOptions={{headerShown:false}}>
      <Tab.Screen
        name='Home'
        component={ManHinhChinh}
        initialParams={{ userId: userId }}
        
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require('./Asset/home1.png') : require('./Asset/home.png')}
              style={{ width: 24, height: 24 ,marginTop:10}}
            />
          ),
          title:'Trang Chủ'
        }}
      />
      <Tab.Screen
        name='Search'
        component={TimKiem}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require('./Asset/search1.png') : require('./Asset/search.png')}
              style={{ width: 24, height: 24 ,marginTop:10}}
            />
          ),
          title:'Tìm Kiếm'
          
        }}
      />
      <Tab.Screen
        name='Bell'
        component={ThongBao}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require('./Asset/bell1.png') : require('./Asset/bell.png')}
              style={{ width: 24, height: 24 ,marginTop:10}}
            />
          ),
          // tabBarLabel: '',
            title:'Thông Báo'
        }}
      />
      <Tab.Screen
        name='CaNhan'
        component={CaNhan}
        initialParams={{ userId: userId }}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require('./Asset/user1.png') : require('./Asset/user.png')}
              style={{ width: 24, height: 24 ,marginTop:10}}
            />
          ),
          // tabBarLabel: '',
          title:'Cá Nhân'

        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='ManHinhChao'>
        <Stack.Screen name='ManHinhChao' component={ManHinhChao} options={{ headerShown: false }} />
        <Stack.Screen name='DangNhap' component={DangNhap} options={{ title: 'Đăng Nhập' }} />
        <Stack.Screen name='DangKy' component={DangKy} options={{ title: 'Đăng Ký' }} />
        <Stack.Screen name='Main' component={MainStackNavigator} options={{ headerShown: false }} />
      <Stack.Screen name='ChiTiet' component={ChiTiet} options={{ title: 'Chi Tiết Sản Phẩm' }} />
      <Stack.Screen name='TimKiem' component={TimKiem} options={{ title: 'Tìm Kiếm Sản Phẩm' }} />
      <Stack.Screen name='ThongBao' component={ThongBao} options={{ title: 'Thông Báo' }} />
      <Stack.Screen name='LichSu' component={LichSu} options={{ title: 'Lịch Sử Mua Hàng' }} />
      <Stack.Screen name='GioHang' component={GioHang} options={{ title: 'Giỏ Hàng' }} />
      <Stack.Screen name='ThanhToan' component={ThanhToan} options={{ title: 'Thanh Toán' }} />
      <Stack.Screen name='CaNhan' component={CaNhan} options={{ title: 'Cá Nhân' }} />
      <Stack.Screen name='ChinhSua' component={ChinhSua} options={{ title: 'Chỉnh Sửa Thông Tin' }} />
      <Stack.Screen name='Q&A' component={QA} options={{ title: 'Q & A' }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

const MainStackNavigator =({ route }: TabNavigatorProps) => {
  const userId = route.params?.userId ?? '';

  return (
    <Stack.Navigator>
      <Stack.Screen name='Main' component={TabNavigator} options={{ headerShown: false }}initialParams={{ userId: userId }} />
    </Stack.Navigator>
  );
};

export default App;
