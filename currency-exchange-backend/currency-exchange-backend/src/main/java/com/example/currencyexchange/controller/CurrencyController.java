package com.example.currencyexchange.controller;

import com.example.currencyexchange.model.CurrencyRate;
import com.example.currencyexchange.service.CurrencyService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/rates")
@CrossOrigin(origins = "http://localhost:5173")
public class CurrencyController {

    private final CurrencyService currencyService;

    public CurrencyController(CurrencyService currencyService) {
        this.currencyService = currencyService;
    }

    @GetMapping
    public List<CurrencyRate> getRates() {
        return currencyService.getAllRates();
    }
}