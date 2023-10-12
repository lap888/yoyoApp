/*
 * @Author: top.brids 
 * @Date: 2019-12-24 22:56:12 
 * @Last Modified by: topbrids@gmail.com
 * @Last Modified time: 2022-10-27 16:18:12
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Colors } from '../theme/Index';
import { EncryptionMobile } from '../../utils/Index';

export default class TeamListItem extends Component {
    static propTypes = {
        item: PropTypes.object
    }
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.item === this.props.item) {
            return false
        }
        return true
    }
    render() {
        let { item, index } = this.props;
        let { mobile, avatarUrl, name, active, teamCount, teamCandyH, contributions, auditState, teamStart, authCount } = item;
        if (!teamStart || teamStart < 0) teamStart = 0;
        //  ?  : ""
        console.log('itemctime]: ', item['ctime']);
        let ctime = '';
        if (item.hasOwnProperty('ctime')) {

            let date = new Date(item['ctime']);
            console.log('date: ', date);
            var Y = date.getFullYear() + '/';
            var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/';
            var D = date.getDate() < 10 ?  '0'+date.getDate()+ ' ' : date.getDate()+ ' ';
            ctime = Y + M + D;
            console.log('ctime: ', ctime);
        }
        return (
            <View style={Styles.bodyItem}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={[Styles.avatar, { overflow: 'visible' }]}>
                        {/* <Image style={Styles.avatar} source={{ uri: `${avatarUrl}` }} /> */}
                        <Image style={Styles.avatar} source={require('../images/logo.png')} />
                    </View>
                    <View style={{flex: 1, marginLeft: 5}}>
                        <Text style={[Styles.phoneNumber,{fontSize: 13}]}>{name}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {teamCount > 1 ?
                                <Text style={[Styles.phoneNumber,{fontSize: 14}]}>{`${mobile} `}</Text> :
                                <Text style={[Styles.phoneNumber]}>{`${EncryptionMobile(mobile)} `}</Text>
                            }
                            {teamStart != 0 && <Text style={[Styles.teamStart]}>{`  ${teamStart}星达人`}</Text>}
                            {<Text style={{fontSize: 12, color:'#53A200'}}>{active > 0 ? '      活跃' : ''}</Text>}
                        </View>
                        <Text style={{ flex: 1, fontSize: 12, color: '#3c4d66', marginTop: 5 }}>注册时间:  {ctime}</Text>
                    </View>
                    <View style={{justifyContent: 'center', alignItems: 'center',width: 46, height: 20, borderRadius: 10, borderWidth: 1, borderColor: Colors.main, backgroundColor: 'rgba(244,131,84,0.2)'}}>
                        <Text style={{fontSize: 12, color: Colors.main}}>{auditState ? '已认证' : '未认证'}</Text>
                    </View>
                </View>

                <View style={{flexDirection: 'row', marginTop: 10}}>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={Styles.teamNumber1}>{`${teamCount}`}</Text>
                        <Text style={Styles.teamNumber2}>{`团队人数`}</Text>
                    </View>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={Styles.teamNumber1}>{`${teamCandyH}`}</Text>
                        <Text style={Styles.teamNumber2}>{`团队活跃度`}</Text>
                    </View>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={Styles.teamNumber1}>{`${authCount}`}</Text>
                        <Text style={Styles.teamNumber2}>{`直推人数`}</Text>
                    </View>
                    {/* <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={Styles.teamNumber1}>{`${contributions}`}</Text>
                        <Text style={Styles.teamNumber2}>{`贡献果核`}</Text>
                    </View> */}
                </View>
                {/* <View style={{ marginLeft: 10, flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={Styles.teamNumber}>{`团队人数 `}</Text>
                            <Text style={[Styles.teamNumber]}>{`${teamCount}`}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={[Styles.teamActivity]}>{`团队活跃度 `}</Text>
                            <Text style={[Styles.teamActivity, { flex: 1 }]}>{`${teamCandyH}`}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={Styles.teamNumber}>{`直推人数 `}</Text>
                            <Text style={[Styles.teamNumber, { flex: 1 }]}>{`${authCount}`}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={[Styles.teamActivity]}>{`贡献果核 `}</Text>
                            <Text style={[Styles.teamActivity, { flex: 1 }]}>{`${contributions}`}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 4 }}>
                        <Text style={{ flex: 1, fontSize: 14, color: Colors.C6, fontWeight: '500' }}>{`${auditState ? "已认证" : "未认证"}`}</Text>
                    </View>
                </View> */}
            </View>
        );
    }
}
const Styles = StyleSheet.create({
    bodyItem: { alignItems: 'center', marginLeft: 15, paddingVertical: 15, paddingRight: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#eceff4' },
    avatar: { width: 35, height: 35, borderRadius: 17.5 },
    phoneNumber: { fontSize: 12, color: '#3c4d66' },
    teamStart: { fontSize: 12, color: Colors.C6 },
    teamNumber1: { fontSize: 14, color: Colors.main },
    teamNumber2: { fontSize: 12, color: '#666', marginTop: 5 },
    teamActivity: { fontSize: 14, color: '#3c4d66' },
    isCertified: { textAlign: 'right', fontSize: 14, color: '#3c4d66' },
    sequence: { flexDirection: 'row', alignItems: 'center', margin: 10, marginTop: 15 },
    sequenceItem: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    sequenceTitle: { fontSize: 14, color: Colors.C11, textDecorationLine: 'underline' },
    dropup: { width: 9, height: 9 },
});
