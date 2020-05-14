import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Card, Paragraph, Title } from 'react-native-paper';
import Axios from 'axios';

const App = () => {
  const [data, setData] = useState<any>([]);
  const [wbDistrictWiseData, setWbDistrictWiseData] = useState<any>([]);
  const [wb, setWb] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [busy, setBusy] = useState<boolean>(false);

  const fetchData = () => {
    setWb(null);
    setWbDistrictWiseData([]);

    setBusy(true);
    Axios
      .get(`https://api.covid19india.org/data.json`)
      .then((res) => {
        setData(res.data.statewise);
      })
      .catch((err) => {
        setError(err);
      });

    Axios
      .get(`https://api.covid19india.org/state_district_wise.json`)
      .then((res) => {
        let fetchedData = res.data['West Bengal'].districtData;
        let newwbDistrictWiseData: any = [];

        Object.keys(fetchedData).forEach(function (key: string, index: number) {
          fetchedData[key].city = key;
          newwbDistrictWiseData.push(fetchedData[key]);
        });

        newwbDistrictWiseData.sort(function (x: any, y: any) {
          if (x.active < y.active) {
            return 1;
          }
          if (x.active > y.active) {
            return -1;
          }
          return 0;
        });

        setWbDistrictWiseData(newwbDistrictWiseData);
      })
      .catch((err) => {
        setError(err);
      });

    setBusy(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setWb(data[10]);
  }, [data]);

  useEffect(() => {
    setWb(null);
    setWbDistrictWiseData([]);
  }, [error])

  const styles = StyleSheet.create({
    root: {
      flex: 1,
      paddingTop: 20,
      paddingBottom: 20,
    },
    container: {
      padding: 20
    },
    cardContainer: {
      margin: 10
    },
    activeCount: {
      color: "red"
    },
    confirmedCount: {
      color: "blue"
    },
    deceasedCount: {
      color: "green"
    },
    recovered: {
      color: "green"
    },
    active: {
      color: "blue"
    },
    deaths: {
      color: "red"
    },
    confirmed: {
      color: "violet"
    }
  })

  return (
    <View style={styles.root}>
      {wb !== null ?
        <Card style={styles.container}>
          <Card.Title
            title="West Bengal"
            subtitle={"Last updateded: " + wb.lastupdatedtime}
            right={(props) => <Button icon="refresh" mode="contained" onPress={fetchData}>
              Refresh
              </Button>}
          />
          <Card.Content>
            <Paragraph>Active <Paragraph style={styles.active}> {wb.active}</Paragraph></Paragraph>
            <Paragraph>Confirmed<Paragraph style={styles.confirmed}> {wb.confirmed}</Paragraph></Paragraph>
            <Paragraph>Deaths<Paragraph style={styles.deaths}> {wb.deaths}</Paragraph></Paragraph>
            <Paragraph>Recovered<Paragraph style={styles.recovered}> {wb.recovered}</Paragraph></Paragraph>
          </Card.Content>
        </Card>
        : <Title>Loading...</Title>}
      <FlatList
        data={wbDistrictWiseData}
        renderItem={({ item }) =>
          <Card style={styles.cardContainer}>
            <Card.Title title={item.city} subtitle="Corona report" />
            <Card.Content>
              <Paragraph >Active <Paragraph style={styles.activeCount} > {item.active}</Paragraph></Paragraph>
              <Paragraph >Confirmed<Paragraph style={styles.confirmedCount} > {item.confirmed}</Paragraph></Paragraph>
              <Paragraph >Deceased<Paragraph style={styles.deceasedCount} > {item.deceased}</Paragraph></Paragraph>
            </Card.Content>
          </Card>
        }
      />
    </View>
  );
}



export default App;