import { Text, View, StyleSheet, Image, Dimensions } from 'react-native';

const windowHeight = Dimensions.get('window').height;

const HeaderModelo = () => {
  return (
    <View style={styles.header}>
    <Text style={styles.nosz}> <Text style={styles.n}>N</Text>ÓSZ</Text>
    <Image source={require('../assets/images/nosz.png')} style={styles.imagemLogo} />
  </View>
  );
}

const styles = StyleSheet.create({
    header:{
        alignItems: 'flex-end',
        marginTop: '7%',
        flexDirection: 'row', 
        justifyContent: 'space-between',
        marginBottom: '-3%'
      },
      nosz:{
        fontSize: 45,
        fontFamily: 'Montserrat_600SemiBold',
        textAlign: 'center',
        color: '#f99a15',
      },
      n:{
        fontSize: 55,
        color: '#e36317'
      },
      imagemLogo:{
        width: Dimensions.get('window').width / 5,
        height: windowHeight / 10
      },
});

export default HeaderModelo;