"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const UserPreferencesSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    calorieGoal: {
        type: Number,
        default: 2000
    },
    macroGoals: {
        protein: {
            type: Number,
            default: 150
        },
        carbs: {
            type: Number,
            default: 200
        },
        fat: {
            type: Number,
            default: 65
        }
    },
    mealTimes: {
        breakfast: {
            type: String,
            default: '08:00'
        },
        lunch: {
            type: String,
            default: '12:00'
        },
        dinner: {
            type: String,
            default: '18:00'
        },
        snacks: {
            type: [String],
            default: ['10:30', '15:30']
        }
    },
    dietaryRestrictions: {
        type: [String],
        default: []
    },
    theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light'
    },
    emailNotifications: {
        type: Boolean,
        default: true
    },
    weeklyReport: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('UserPreferences', UserPreferencesSchema);
