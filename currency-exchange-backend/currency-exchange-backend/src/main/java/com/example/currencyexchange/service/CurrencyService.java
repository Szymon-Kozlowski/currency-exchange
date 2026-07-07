package com.example.currencyexchange.service;

import com.example.currencyexchange.model.CurrencyRate;
import com.example.currencyexchange.repository.CurrencyRateRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CurrencyService {

    private final CurrencyRateRepository repository;
    private final RestClient restClient;

    public CurrencyService(CurrencyRateRepository repository) {
        this.repository = repository;
        this.restClient = RestClient.builder()
                .baseUrl("https://api.frankfurter.dev/v2")
                .build();
    }

    public List<CurrencyRate> getAllRates() {
        return repository.findAll();
    }

    @Scheduled(initialDelay = 0, fixedRate = 3600000)
    public void fetchExchangeRates() {
        System.out.println("Fetching fresh exchange rates from external API...");

        try {
            FrankfurterRate[] response = restClient.get()
                    .uri("/rates?base=USD")
                    .retrieve()
                    .body(FrankfurterRate[].class);

            if (response != null) {
                repository.save(new CurrencyRate("USD", 1.0, LocalDateTime.now()));
                for (FrankfurterRate apiRate : response) {
                    CurrencyRate entity = new CurrencyRate(
                            apiRate.quote(),
                            apiRate.rate(),
                            LocalDateTime.now()
                    );
                    repository.save(entity);
                }
                System.out.println("Successfully updated database cache with " + response.length + " currencies.");
            }
        } catch (Exception e) {
            System.err.println("Failed to fetch rates from API: " + e.getMessage());
        }
    }
}