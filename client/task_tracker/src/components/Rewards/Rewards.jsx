import React, { useState, useEffect } from "react";
import Axios from 'axios';
import './Rewards.css'; // Assuming similar CSS rules can be applied, you might need to create this
import { FaRegTrashAlt, FaPencilAlt } from 'react-icons/fa';
import { Button } from '../Button'; // Reuse the Button component
import '../../components/Button.css'; // Reusing existing button styles

const Rewards = () => {
    const [allRewards, setAllRewards] = useState([]);
    const [showRewardsPopup, setShowRewardsPopup] = useState(false);
    const [selectedReward, setSelectedReward] = useState('');
    const [pointsNeeded, setPointsNeeded] = useState('');

    useEffect(() => {
        fetchRewards();
    }, []);

    const fetchRewards = async () => {
        const response = await Axios.get('http://localhost:3001/rewards');
        if (response.data) {
            setAllRewards(response.data);
        }
    };

    const handleAddReward = () => {
        setShowRewardsPopup(true);
    };

    const handleSaveReward = async () => {
        // Placeholder for POST or PUT logic
        setShowRewardsPopup(false);
    };

    const handleDeleteReward = async (rewardId) => {
        // Placeholder for DELETE logic
        fetchRewards();
    };

    return (
        <div className='RewardsContainer'>
            <div className='RewardsHeader'>
                <h1 className='TitleSection'>Rewards</h1>
                <div className="AddRewardButton">
                    <Button onClick={handleAddReward}>Add Reward</Button>
                </div>
            </div>
            {allRewards.map((reward, index) => (
                <div className='RewardRow' key={index}>
                    <div className='Name'>{reward.name}</div>
                    <div className='Points'>{reward.points} Points</div>
                    <div className='Action'>
                        <FaPencilAlt onClick={() => { /* Set edit state */ }} />
                        <FaRegTrashAlt onClick={() => handleDeleteReward(reward.id)} />
                    </div>
                </div>
            ))}
            {/* Popup for creating/editing a reward */}
            {showRewardsPopup && (
                <div className="popupRewards">
                    <div className="popupHeader">
                        <h2>{selectedReward ? "Edit Reward" : "New Reward"}</h2>
                        <Button onClick={() => setShowRewardsPopup(false)}>Close</Button>
                    </div>
                    <div className="popupContent">
                        <label>Reward Name:</label>
                        <input type="text" value={selectedReward} onChange={e => setSelectedReward(e.target.value)} />
                        <label>Points Needed:</label>
                        <input type="number" value={pointsNeeded} onChange={e => setPointsNeeded(e.target.value)} />
                        <Button onClick={handleSaveReward}>Save Reward</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Rewards;
