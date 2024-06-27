import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View, Text } from 'react-native';

const ModalConfirm = ({ visible, setVisible, action, message }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <TouchableOpacity style={styles.modalContainer} onPress={() => setVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>{message}</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={action} style={[styles.button, styles.confirmButton]}>
              <Text style={styles.buttonText}>Sim</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setVisible(false)} style={[styles.button]}>
              <Text style={styles.buttonTextCancel}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContent: {
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 10,
        width: '100%',
      },
      modalText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: 'Montserrat_600SemiBold'
      },
      modalButtons: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        textAlign: 'center'
      },
      button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        margin: 10,
      },
      confirmButton: {
        backgroundColor: '#e36317',
      },
      buttonTextCancel: {
        color: '#e36317',
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'Montserrat_500Medium'
      },
      buttonText: {
        color: '#F5F5F5',
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'Montserrat_500Medium'
      },
});

export default ModalConfirm;
