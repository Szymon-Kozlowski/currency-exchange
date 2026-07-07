package com.example.currencyexchange.repository;

import com.example.currencyexchange.model.CurrencyRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CurrencyRateRepository extends JpaRepository<CurrencyRate, String> {
}