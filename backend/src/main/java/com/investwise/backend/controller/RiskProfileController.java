package com.investwise.backend.controller;

import com.investwise.backend.model.RiskProfile;
import com.investwise.backend.repository.RiskProfileRepository;
import com.investwise.backend.service.AdvisorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/risk-profile")
@CrossOrigin(origins = "http://localhost:5173")
public class RiskProfileController {

    @Autowired
    private AdvisorService advisorService;

    @Autowired
    private RiskProfileRepository riskProfileRepository;

    @PostMapping("/assess")
    public ResponseEntity<RiskProfile> assessRisk(@RequestBody RiskProfile profile) {
        RiskProfile savedProfile = advisorService.assessRiskAndGenerateStrategy(profile);
        return ResponseEntity.ok(savedProfile);
    }

    @GetMapping("/latest")
    public ResponseEntity<RiskProfile> getLatestProfile() {
        return riskProfileRepository.findFirstByOrderByIdDesc()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }
}
