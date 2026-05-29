package com.investwise.backend.service;

import com.investwise.backend.model.RiskProfile;
import com.investwise.backend.repository.RiskProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdvisorService {

    @Autowired
    private RiskProfileRepository riskProfileRepository;

    public RiskProfile assessRiskAndGenerateStrategy(RiskProfile questionnaire) {
        int score = calculateRiskScore(questionnaire);
        String category = determineCategory(score);
        String strategy = generateStrategyMarkdown(category, score);

        questionnaire.setRiskScore(score);
        questionnaire.setRiskCategory(category);
        questionnaire.setInvestmentStrategy(strategy);

        return riskProfileRepository.save(questionnaire);
    }

    private int calculateRiskScore(RiskProfile profile) {
        int score = 0;

        // Age Group
        if (profile.getAgeGroup() != null) {
            switch (profile.getAgeGroup().toLowerCase()) {
                case "under 30": score += 5; break;
                case "30-45": score += 4; break;
                case "45-60": score += 2; break;
                case "over 60": score += 1; break;
                default: score += 3;
            }
        }

        // Investment Goal
        if (profile.getInvestmentGoal() != null) {
            switch (profile.getInvestmentGoal().toLowerCase()) {
                case "wealth accumulation": score += 5; break;
                case "retirement": score += 3; break;
                case "saving for a big purchase": score += 2; break;
                case "income generation": score += 1; break;
                default: score += 3;
            }
        }

        // Market Reaction
        if (profile.getMarketReaction() != null) {
            switch (profile.getMarketReaction().toLowerCase()) {
                case "buy more": score += 5; break;
                case "do nothing": score += 3; break;
                case "sell everything": score += 1; break;
                default: score += 3;
            }
        }

        // Investment Horizon
        if (profile.getInvestmentHorizon() != null) {
            switch (profile.getInvestmentHorizon().toLowerCase()) {
                case "15+ years": score += 5; break;
                case "7-15 years": score += 4; break;
                case "3-7 years": score += 2; break;
                case "<3 years": score += 1; break;
                default: score += 3;
            }
        }

        // Knowledge Level
        if (profile.getKnowledgeLevel() != null) {
            switch (profile.getKnowledgeLevel().toLowerCase()) {
                case "expert": score += 5; break;
                case "intermediate": score += 3; break;
                case "beginner": score += 1; break;
                default: score += 3;
            }
        }

        return score;
    }

    private String determineCategory(int score) {
        if (score <= 9) {
            return "Conservative";
        } else if (score <= 14) {
            return "Moderately Conservative";
        } else if (score <= 19) {
            return "Balanced";
        } else if (score <= 22) {
            return "Growth";
        } else {
            return "Aggressive";
        }
    }

    private String generateStrategyMarkdown(String category, int score) {
        StringBuilder sb = new StringBuilder();
        sb.append("### Your Investment Persona: **").append(category).append("** (Score: ").append(score).append("/25)\n\n");
        
        switch (category) {
            case "Conservative":
                sb.append("#### Recommended Asset Allocation\n");
                sb.append("*   **Fixed Income (Bonds/FDs):** 60%\n");
                sb.append("*   **Equities (Large Cap/Index Funds):** 20%\n");
                sb.append("*   **Gold & Commodities:** 15%\n");
                sb.append("*   **Cash & Liquid Funds:** 5%\n\n");
                sb.append("#### Advisor Insights\n");
                sb.append("Based on your risk profile, capital preservation is your primary objective. High equity exposure is not recommended due to market volatility. Focus on high-quality bonds and dividend-paying stocks to secure a steady income stream.\n\n");
                sb.append("#### Actionable Steps\n");
                sb.append("1. **Emergency Fund:** Ensure 6-12 months of expenses are kept in liquid funds.\n");
                sb.append("2. **Core Portfolio:** Invest in low-cost government bond ETFs or corporate bonds.\n");
                sb.append("3. **Equity Exposure:** Limit stock investments to blue-chip companies with stable earnings.");
                break;
            case "Moderately Conservative":
                sb.append("#### Recommended Asset Allocation\n");
                sb.append("*   **Fixed Income (Bonds/FDs):** 45%\n");
                sb.append("*   **Equities (Large Cap/Index Funds):** 40%\n");
                sb.append("*   **Gold & Commodities:** 10%\n");
                sb.append("*   **Cash & Liquid Funds:** 5%\n\n");
                sb.append("#### Advisor Insights\n");
                sb.append("You are looking for modest growth while maintaining a buffer against severe market downturns. A hybrid portfolio of equities and debt will help achieve this. Large-cap stock indexes will drive growth, while bonds mitigate volatility.\n\n");
                sb.append("#### Actionable Steps\n");
                sb.append("1. **Asset Mix:** Focus on Balanced Advantage Funds or Conservative Hybrid Mutual Funds.\n");
                sb.append("2. **Growth Core:** Invest in Large-Cap index funds (like S&P 500 or Nifty 50).\n");
                sb.append("3. **Protection:** Hold 45% in top-rated debt mutual funds or high-yield savings accounts.");
                break;
            case "Balanced":
                sb.append("#### Recommended Asset Allocation\n");
                sb.append("*   **Equities (Large/Mid Cap):** 60%\n");
                sb.append("*   **Fixed Income (Bonds/Debt):** 25%\n");
                sb.append("*   **Gold & Commodities:** 10%\n");
                sb.append("*   **Cryptocurrencies / High-Growth Alternatives:** 5%\n\n");
                sb.append("#### Advisor Insights\n");
                sb.append("A balanced approach fits you perfectly. You seek long-term capital appreciation but want a safety net during bear markets. You are comfortable with moderate swings and can allocate a small portion to speculative assets like crypto for higher returns.\n\n");
                sb.append("#### Actionable Steps\n");
                sb.append("1. **Diversify:** Establish a 60/40 or 70/30 stock-to-bond portfolio.\n");
                sb.append("2. **Core Equities:** Invest in Broad Market index funds (70% of equity part) and Mid-Cap growth funds (30% of equity part).\n");
                sb.append("3. **Alternative Exposure:** Allocate 5% of your portfolio to top-tier cryptocurrencies (Bitcoin/Ethereum) to capture growth trends.");
                break;
            case "Growth":
                sb.append("#### Recommended Asset Allocation\n");
                sb.append("*   **Equities (Large/Mid/Small Cap):** 75%\n");
                sb.append("*   **Fixed Income (Bonds):** 10%\n");
                sb.append("*   **Cryptocurrencies / High-Growth Alternatives:** 10%\n");
                sb.append("*   **Cash & Liquid Funds:** 5%\n\n");
                sb.append("#### Advisor Insights\n");
                sb.append("You seek substantial wealth accumulation over a longer horizon. You can tolerate short-to-medium-term drawdowns in exchange for outsized returns. Growth-oriented equities and high-conviction alternative assets should form the core of your holdings.\n\n");
                sb.append("#### Actionable Steps\n");
                sb.append("1. **Core Growth:** Focus on Sectoral ETFs (Technology, Healthcare) and Mid-Cap/Small-Cap funds.\n");
                sb.append("2. **Regular SIPs:** Set up automated monthly investments to benefit from dollar-cost averaging.\n");
                sb.append("3. **Crypto Allocation:** Limit crypto and high-risk plays to 10% maximum to manage total downside risk.");
                break;
            case "Aggressive":
                sb.append("#### Recommended Asset Allocation\n");
                sb.append("*   **Equities (Small/Mid Cap, Growth, Sectoral):** 85%\n");
                sb.append("*   **Cryptocurrencies / High-Growth Alternatives:** 10%\n");
                sb.append("*   **Cash & Liquid Funds:** 5%\n");
                sb.append("*   **Fixed Income:** 0%\n\n");
                sb.append("#### Advisor Insights\n");
                sb.append("You are an aggressive investor looking for maximum compound growth. You view market drops as buying opportunities and have a long time horizon. A heavily equity and alternative asset-skewed portfolio is appropriate for your goals.\n\n");
                sb.append("#### Actionable Steps\n");
                sb.append("1. **Aggressive Equities:** Build a core of tech/growth stocks, mid-cap ETFs, and emerging market funds.\n");
                sb.append("2. **Opportunistic Buying:** Keep 5% cash to buy during major market corrections.\n");
                sb.append("3. **Risk Management:** Rebalance annually to ensure your volatile crypto or single-stock holdings do not grow to consume too much of your portfolio.");
                break;
        }
        return sb.toString();
    }
}
