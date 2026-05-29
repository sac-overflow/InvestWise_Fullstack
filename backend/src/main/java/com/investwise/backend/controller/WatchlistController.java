package com.investwise.backend.controller;

import com.investwise.backend.model.WatchlistItem;
import com.investwise.backend.repository.WatchlistItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/watchlist")
@CrossOrigin(origins = "http://localhost:5173")
public class WatchlistController {

    @Autowired
    private WatchlistItemRepository watchlistRepository;

    @GetMapping
    public List<WatchlistItem> getWatchlist() {
        return watchlistRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> addToWatchlist(@RequestBody WatchlistItem item) {
        if (watchlistRepository.findBySymbol(item.getSymbol()).isPresent()) {
            return ResponseEntity.badRequest().body("Asset is already in the watchlist");
        }
        return ResponseEntity.ok(watchlistRepository.save(item));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeFromWatchlist(@PathVariable Long id) {
        return watchlistRepository.findById(id)
                .map(item -> {
                    watchlistRepository.delete(item);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
