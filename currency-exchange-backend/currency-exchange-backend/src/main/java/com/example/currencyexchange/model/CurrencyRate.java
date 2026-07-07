package com.example.currencyexchange.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import java.time.LocalDateTime;

@Entity
public class CurrencyRate {

    @Id
    private String currencyCode;
    private Double rate;
    private LocalDateTime lastUpdated;

    public CurrencyRate() {}

    public CurrencyRate(String currencyCode, Double rate, LocalDateTime lastUpdated) {
        this.currencyCode = currencyCode;
        this.rate = rate;
        this.lastUpdated = lastUpdated;
    }

    public String getCurrencyCode() { return currencyCode; }
    public void setCurrencyCode(String currencyCode) { this.currencyCode = currencyCode; }

    public Double getRate() { return rate; }
    public void setRate(Double rate) { this.rate = rate; }

    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
}