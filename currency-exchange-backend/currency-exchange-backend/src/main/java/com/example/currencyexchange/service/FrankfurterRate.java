package com.example.currencyexchange.service;

import java.time.LocalDate;

record FrankfurterRate(LocalDate date, String base, String quote, Double rate) {}