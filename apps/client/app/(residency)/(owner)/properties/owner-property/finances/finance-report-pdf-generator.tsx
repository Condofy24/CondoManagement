import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { Unit, Payment } from "@/types";

const styles = StyleSheet.create({
  page: { flexDirection: "column", padding: 25 },
  table: {
    fontSize: 10,
    width: 550,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignContent: "stretch",
    flexWrap: "nowrap",
    alignItems: "stretch",
  },
  row: {
    display: "flex",
    paddingLeft: 8,
    flexDirection: "row",
    justifyContent: "space-around",
    alignContent: "stretch",
    flexWrap: "nowrap",
    alignItems: "stretch",
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 35,
  },
  cell: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 30,
    alignSelf: "stretch",
  },
  header: {
    backgroundColor: "#eee",
    marginBottom: 8,
  },
  headerText: {
    fontSize: 11,
    fontWeight: 1200,
    color: "#1a245c",
    margin: 8,
  },
  tableText: {
    margin: 10,
    fontSize: 10,
    color: "black",
  },
  textCenter: {
    textAlign: "center",
  },
  propertyInfoCell: {
    flexGrow: 1,
    flexShrink: 1,
    display: "flex",
    justifyContent: "flex-start",
    fontWeight: "bold",
  },
  textLeft: {
    display: "flex",
    justifyContent: "flex-start",
  },
});

type FinanceReportPDFDocumentProps = {
  property: Unit;
  payments: Payment[];
};

export const FinanceReportPDFDocument = ({
  property,
  payments,
}: FinanceReportPDFDocumentProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.table}>
        <View style={[styles.row, styles.header]}>
          <Text style={[styles.headerText, styles.cell, styles.textCenter]}>
            Property Information
          </Text>
        </View>
        <View style={styles.row}>
          <View style={[styles.propertyInfoCell]}>
            <Text>Property Name</Text>
          </View>
          <View style={styles.propertyInfoCell}>
            <Text style={styles.textLeft}>{property.buildingName}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={[styles.propertyInfoCell]}>
            <Text>Address</Text>
          </View>
          <View style={styles.propertyInfoCell}>
            <Text style={styles.textLeft}>{property.buildingAddress}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={[styles.propertyInfoCell]}>
            <Text>Unit Number</Text>
          </View>
          <View style={styles.propertyInfoCell}>
            <Text style={styles.textLeft}>{property.unitNumber}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={[styles.propertyInfoCell]}>
            <Text>Monthly Fees</Text>
          </View>
          <View style={styles.propertyInfoCell}>
            <Text style={styles.textLeft}>
              {property.totalMonthlyFees.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.table}>
        <View style={[styles.row, styles.header]}>
          <Text style={[styles.headerText, styles.cell]}>Date</Text>
          <Text style={[styles.headerText, styles.cell]}>Time</Text>
          <Text style={[styles.headerText, styles.cell]}>Amount</Text>
        </View>
        {payments.map((payment: Payment) => {
          return (
            <View style={styles.row} key={payment.date.toLocaleString()}>
              <View style={styles.cell}>
                <Text>{new Date(payment.date).toDateString()}</Text>
              </View>
              <View style={styles.cell}>
                <Text>
                  {new Date(payment.date).toLocaleTimeString("en-US")}
                </Text>
              </View>
              <View style={styles.cell}>
                <Text>
                  {payment.amount.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </Page>
  </Document>
);
