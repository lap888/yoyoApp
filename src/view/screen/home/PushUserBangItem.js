/*
 * @Author: top.brids 
 * @Date: 2020-01-04 21:56:24 
 * @Last Modified by: top.brids
 * @Last Modified time: 2020-03-17 01:38:30
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Image } from 'react-native';
import { BoxShadow } from 'react-native-shadow';
import { Metrics, Colors } from '../../theme/Index';
import LinearGradient from 'react-native-linear-gradient';
export default class PushUserBangItem extends PureComponent {
    static propTypes = {
        item: PropTypes.object,
    };
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        let { rank, mobile, nick, headImg, inviteTotal, inviteDay } = item;
        const shadowOpt = {
            height: 69,
            width: Metrics.screenWidth - 30,
            color: Colors.C6,
            border: 2,
            radius: 6,
            opacity: 0.8,
            x: 0,
            y: 0,
            style: Styles.transactionContainer
        }
        return (
            <LinearGradient colors={[item.colors, Colors.LightG]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={Styles.miningItem}>
                <View style={Styles.miningItemHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{ width: 30, height: 30 }} source={{ uri: headImg }} />
                        {/* <Text style={Styles.miningItemName}>{`${item.minningName}`}</Text> */}
                        <Text style={Styles.miningItemActivity}>{`昵称${nick}`}</Text>
                    </View>
                </View>
                <View style={Styles.miningItembody}>
                    {/* <View>
                        <Text style={Styles.miningItemGemin}>{`兑换所需：${item.candyIn}个`}</Text>
                        <Text style={Styles.miningItemGemout}>{`糖果产量：${item.candyOut}个`}</Text>
                        <Text style={Styles.miningItemActivity}>{`持有上限：${item.maxHave}个`}</Text>
                        <Text style={Styles.miningItemTime}>{`任务周期：${item.runTime}`}</Text>
                    </View> */}
                </View>
            </LinearGradient >
            // <BoxShadow setting={shadowOpt}>
            //     <View style={Styles.transaction}>
            //         <View style={Styles.body}>
            //             <View style={Styles.saleInfo}>
            //                 {/* <View style={{ marginLeft: 5 }}>
            //                     <Image style={{ width: 50, height: 50 }} source={{ uri: headImg }} />
            //                 </View> */}
            //                 <Text style={Styles.number}>{`昵称: `}</Text>
            //                 <Text style={Styles.number}>{`${nick}`}</Text>
            //                 <Text style={Styles.price}>{`排行榜名次: `}</Text>
            //                 <Text style={Styles.price}>{`${rank}`}</Text>
            //             </View>
            //             {/* <View style={{ flexDirection: 'row', marginTop: 6 }}>
            //                 <Text style={Styles.number}>{`手机号: `}</Text>
            //                 <Text style={Styles.number}>{`${mobile}`}</Text>
            //             </View>
            //             <View style={{ flexDirection: 'row', marginTop: 6 }}>
            //                 <Text style={Styles.number}>{`日拉新: `}</Text>
            //                 <Text style={Styles.number}>{`${inviteDay}`}</Text>
            //                 <Text style={Styles.number}>{`月拉新: `}</Text>
            //                 <Text style={Styles.number}>{`${inviteTotal}`}</Text>
            //             </View> */}
            //         </View>
            //     </View>
            // </BoxShadow>
        );
    }
}
const Styles = StyleSheet.create({
    transactionContainer: { left: 15, marginBottom: 10 },
    transaction: { height: 200, margin: 1, flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 6, backgroundColor: '#FFFFFF' },
    avatar: { height: 50, width: 50, borderRadius: 25 },
    name: { fontWeight: 'bold', fontSize: 16 },
    body: { flex: 2, marginLeft: 14 },
    saleInfo: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    price: { fontSize: 14, color: Colors.C6 },
    number: { fontSize: 14, color: Colors.C6 },
    transactionNumber: { fontSize: 14, color: "rgb(170,202,193)" },
    sale: { alignSelf: 'center', justifyContent: 'center', alignItems: 'center', padding: 5, paddingLeft: 10, paddingRight: 10, borderRadius: 5, backgroundColor: Colors.C6 },
    saleText: { fontSize: 15, color: '#FFFFFF' },


    miningItem: { margin: 10, marginBottom: 0, backgroundColor: '#53b488', borderRadius: 5, padding: 15 },
    miningItemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    miningItemName: { fontSize: 18, color: '#ffffff' },
    miningItemActivity: { fontSize: 14, color: '#ffffff' },
    miningItembody: { marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' },
    miningItemGemin: { fontSize: 14, color: '#ffffff' },
    miningItemGemout: { marginTop: 6, fontSize: 14, color: '#ffffff' },
    miningItemTime: { marginTop: 6, fontSize: 14, color: '#ffffff', width: 320 },
    miningItemFooter: { alignSelf: 'flex-end', justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#ffffff', padding: 18, paddingTop: 10, paddingBottom: 10 },
    miningItemExchange: { fontSize: 18, color: '#ffffff' },
});

