package com.investwise.backend.config;

import com.investwise.backend.model.Asset;
import com.investwise.backend.model.CalculatorGoal;
import com.investwise.backend.model.WatchlistItem;
import com.investwise.backend.repository.AssetRepository;
import com.investwise.backend.repository.CalculatorGoalRepository;
import com.investwise.backend.repository.WatchlistItemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(AssetRepository assetRepository,
                                   WatchlistItemRepository watchlistRepository,
                                   CalculatorGoalRepository goalRepository) {
        return args -> {
            // Seed Assets
            if (assetRepository.count() == 0) {
                assetRepository.save(new Asset("AAPL", "Apple Inc.", 10.0, 150.00, 175.50, "STOCK"));
                assetRepository.save(new Asset("TSLA", "Tesla Inc.", 5.0, 220.00, 190.00, "STOCK"));
                assetRepository.save(new Asset("BTC", "Bitcoin", 0.5, 35000.00, 62450.00, "CRYPTO"));
                assetRepository.save(new Asset("ETH", "Ethereum", 2.5, 1800.00, 3120.00, "CRYPTO"));
                System.out.println("★ InvestWise: Prepopulated 4 mock assets.");
            }

            // Seed Watchlist Items
            if (watchlistRepository.count() == 0) {
                watchlistRepository.save(new WatchlistItem("NVDA", "NVIDIA Corp.", "STOCK", 950.00));
                watchlistRepository.save(new WatchlistItem("GOOGL", "Alphabet Inc.", "STOCK", 175.00));
                watchlistRepository.save(new WatchlistItem("SOL", "Solana", "CRYPTO", 155.00));
                System.out.println("★ InvestWise: Prepopulated 3 watchlist items.");
            }

            // Seed Calculator Goals
            if (goalRepository.count() == 0) {
                goalRepository.save(new CalculatorGoal("Early Retirement Plan", 10000.0, 500.0, 8.0, 15, 178550.0));
                goalRepository.save(new CalculatorGoal("House Downpayment", 5000.0, 1000.0, 6.0, 5, 73560.0));
                System.out.println("★ InvestWise: Prepopulated 2 saved calculator goals.");
            }
        };
    }
}
