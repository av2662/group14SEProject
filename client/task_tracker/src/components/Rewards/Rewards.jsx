import React, { useState } from "react";
import './Rewards.css';
import { Button } from '../Button';
import '../../components/Button.css';

const Rewards = () => {
    const [allRewards, setAllRewards] = useState([
        { id: 0, name: "Free Coffee", points: 100 },
        { id: 1, name: "Extra Day Off", points: 500 },
        { id: 2, name: "Movie Tickets", points: 200 },
        { id: 3, name: "Gift Card", points: 300 }
    ]);
    const [showRewardsPopup, setShowRewardsPopup] = useState(false);
    const [selectedReward, setSelectedReward] = useState(null);
    const [rewardName, setRewardName] = useState('');
    const [pointsNeeded, setPointsNeeded] = useState('');

    const handleAddRewardClick = () => {
        setSelectedReward(null);
        setRewardName('');
        setPointsNeeded('');
        setShowRewardsPopup(true);
    };

    const handleEditRewardClick = (reward) => {
        setSelectedReward(reward);
        setRewardName(reward.name);
        setPointsNeeded(reward.points);
        setShowRewardsPopup(true);
    };

    const handleClosePopup = () => {
        setShowRewardsPopup(false);
    };

    const handleSaveReward = () => {
        if (selectedReward) {
            const updatedRewards = allRewards.map(reward =>
                reward.id === selectedReward.id ? { ...reward, name: rewardName, points: pointsNeeded } : reward
            );
            setAllRewards(updatedRewards);
        } else {
            const newReward = {
                id: allRewards.length,
                name: rewardName,
                points: pointsNeeded
            };
            setAllRewards([...allRewards, newReward]);
        }
        setShowRewardsPopup(false);
    };

    const handleDeleteReward = (rewardId) => {
        const updatedRewards = allRewards.filter(reward => reward.id !== rewardId);
        setAllRewards(updatedRewards);
    };

    return (
        <div className='RewardsContainer'>
            <div className='RewardsHeader'>
                <h1 className='TitleSection'>Rewards</h1>
                <Button buttonSize='btn--small' buttonColor='maroon' onClick={handleAddRewardClick}>Add Reward</Button>
            </div>
            {allRewards.map((reward, index) => (
                <div className='RewardRow' key={`reward-number-${index}`}>
                    <div className='Name'>{reward.name} - {reward.points} Points</div>
                    <div className='Action'>
                        <Button onClick={() => handleEditRewardClick(reward)}>Edit</Button>
                        <Button onClick={() => handleDeleteReward(reward.id)}>Delete</Button>
                    </div>
                </div>
            ))}
            {showRewardsPopup && (
                <div className="popupRewards">
                    <div className="popupHeader">
                        <h2>{selectedReward ? "Edit Reward" : "New Reward"}</h2>
                        <Button buttonSize='btn--small' buttonColor='maroon' onClick={handleClosePopup}>Close</Button>
                    </div>
                    <div className="popupContent">
                        <label>Reward Name:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={rewardName}
                            onChange={(e) => setRewardName(e.target.value)}
                        />
                        <label>Points Needed:</label>
                        <input
                            type="number"
                            className="form-control"
                            value={pointsNeeded}
                            onChange={(e) => setPointsNeeded(e.target.value)}
                        />
                        <Button buttonSize='btn--small' buttonColor='maroon' onClick={handleSaveReward}>Save Reward</Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Rewards;
