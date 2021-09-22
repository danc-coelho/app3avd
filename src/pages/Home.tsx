import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, TextInput, Platform, FlatList, Alert, TouchableOpacity, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Col, Row, Grid } from 'react-native-easy-grid';


interface IPais {
    id: string;
    nome: string;
}


export function Home() {
    const total = 195;
    const [nome, setnome] = useState('');
    const [id, setId] = useState('');
    
    const [toDelete, setToDelete] = useState('');

    const [Paises, setPaises] = useState<IPais[]>([]);

    useEffect(() => {
        async function loadStorage(){
            const storagedPersons = await AsyncStorage.getItem('storage');

            if(storagedPersons){
                setPaises(JSON.parse(storagedPersons));
            }
        }

        loadStorage();
    }, []);

    useEffect(() => {
        async function removeAll(){
            await AsyncStorage.removeItem('storage');
        }

        removeAll();
    }, [Paises]);

    useEffect(() => {
        async function saveStorage(){
            await AsyncStorage.setItem('storage', JSON.stringify(Paises));
        }

        saveStorage();
    }, [Paises]);
    
    function handleAddNewPais() {
        if(!validations()){
            return;
        }
        
        const data: IPais = {
            id: id,
            nome: nome
        }

        setPaises([...Paises, data]);

        setId('');
        setnome('');
    }
    
    function handleRemovePais(id: string){
        setPaises(Paises.filter(c => c.id !== id));
    }
    
    function validations(): boolean {
        const title: string = 'Opss...';
        const messages: string[] = [];
        
        if(id === null || id === ''){
            messages.push('DDI está vazio');
        }
        
        if(nome === null || nome === ''){
            messages.push('Insira o nome do país');
        }
        
        if(messages.length > 0){
            Alert.alert(title, messages.join('\n'));
            return false;
        }
        
        return true;
    }
    

    return (
        <>            
            <View style={styles.container}>
                <Text style={styles.geodex}>🌐 GeoDEX </Text>
                <Text style={styles.title}>Faltam {total-Paises.length} países para você conhecer o mundo tudo.</Text>

                <TextInput value={id} placeholder={'DDI (Código de Área Internacional)'} placeholderTextColor={'#555'} style={styles.input}
                           onChangeText={value => setId(value)} />

                <TextInput value={nome} placeholder={'Nome do país visitado'} placeholderTextColor={'#555'} style={styles.input}
                           onChangeText={value => setnome(value)} />

                <TouchableOpacity style={styles.button} activeOpacity={0.6} onPress={handleAddNewPais} >
                    <Text style={styles.buttonText}>
                        Visitei
                    </Text>
                </TouchableOpacity>

                <TextInput placeholder={'Insira DDI de Pais registrado incorretamente'} placeholderTextColor={'#555'} style={styles.input} onChangeText={value => setToDelete(value)} />

                <TouchableOpacity style={styles.button} activeOpacity={0.6} onPress={() => handleRemovePais(toDelete)}>
                    <Text style={styles.buttonText}>
                        Apagar
                    </Text>
                </TouchableOpacity>

                
                <Grid style={styles.table}>
                    <Col size={10}>
                        <Row style={styles.cell}>
                            <Text style={styles.tableContent}>DDI</Text>
                        </Row>

                        {Paises.map(c => {
                            return(
                                <Row style={styles.cell} key={c.id}>
                                    <Text style={styles.tableContent}>
                                        {c.id}
                                    </Text>
                                </Row>
                            )
                        })}
                    </Col>

                    <Col size={10}>
                        <Row style={styles.cell}>
                            <Text style={styles.tableContent}>Pais</Text>
                        </Row>
                        
                        {Paises.map(c => {
                            return(
                                <Row style={styles.cell} key={c.id}>
                                    <Text style={styles.tableContent}>
                                        {c.nome}
                                    </Text>
                                </Row>     
                            )
                        })}
                    </Col>
                </Grid>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121015',
        paddingHorizontal: 30,
        paddingVertical: 70
    },
    geodex: {
        color: 'white',
        fontSize: 26,
        fontWeight: 'bold',
        paddingBottom: 5,
        alignItems: 'center'
    },    
    title: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        paddingBottom: 5
    },
    input: {
        backgroundColor: '#1f1e25',
        color: '#fff',
        fontSize: 18,
        padding: Platform.OS === 'ios' ? 15 : 12,
        marginTop: 30,
        borderRadius: 7
    },
    button: {
        backgroundColor: '#4fc8e0',
        padding: 15,
        borderRadius: 7,
        alignItems: 'center',
        marginTop: 30
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    },
    table: {
        paddingVertical: 30
    },
    cell: {
        borderWidth: 1,
        borderColor: '#ddd',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    tableContent: {
        color: '#fff'
    }
});