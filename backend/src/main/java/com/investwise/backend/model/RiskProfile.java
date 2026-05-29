package com.investwise.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "risk_profiles")
public class RiskProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ageGroup;
    private String investmentGoal;
    private String marketReaction;
    private String investmentHorizon;
    private String knowledgeLevel;
    
    private Integer riskScore;
    private String riskCategory; // e.g., "Conservative", "Balanced", "Aggressive"

    @Column(columnDefinition = "TEXT")
    private String investmentStrategy; // Detailed response with recommended asset allocation

    public RiskProfile() {}

    public RiskProfile(String ageGroup, String investmentGoal, String marketReaction, String investmentHorizon, String knowledgeLevel, Integer riskScore, String riskCategory, String investmentStrategy) {
        this.ageGroup = ageGroup;
        this.investmentGoal = investmentGoal;
        this.marketReaction = marketReaction;
        this.investmentHorizon = investmentHorizon;
        this.knowledgeLevel = knowledgeLevel;
        this.riskScore = riskScore;
        this.riskCategory = riskCategory;
        this.investmentStrategy = investmentStrategy;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAgeGroup() {
        return ageGroup;
    }

    public void setAgeGroup(String ageGroup) {
        this.ageGroup = ageGroup;
    }

    public String getInvestmentGoal() {
        return investmentGoal;
    }

    public void setInvestmentGoal(String investmentGoal) {
        this.investmentGoal = investmentGoal;
    }

    public String getMarketReaction() {
        return marketReaction;
    }

    public void setMarketReaction(String marketReaction) {
        this.marketReaction = marketReaction;
    }

    public String getInvestmentHorizon() {
        return investmentHorizon;
    }

    public void setInvestmentHorizon(String investmentHorizon) {
        this.investmentHorizon = investmentHorizon;
    }

    public String getKnowledgeLevel() {
        return knowledgeLevel;
    }

    public void setKnowledgeLevel(String knowledgeLevel) {
        this.knowledgeLevel = knowledgeLevel;
    }

    public Integer getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(Integer riskScore) {
        this.riskScore = riskScore;
    }

    public String getRiskCategory() {
        return riskCategory;
    }

    public void setRiskCategory(String riskCategory) {
        this.riskCategory = riskCategory;
    }

    public String getInvestmentStrategy() {
        return investmentStrategy;
    }

    public void setInvestmentStrategy(String investmentStrategy) {
        this.investmentStrategy = investmentStrategy;
    }
}
