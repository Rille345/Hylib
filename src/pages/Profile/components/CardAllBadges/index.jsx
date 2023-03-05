import React from "react";
import Badge from "./Badge";
import "./style.css";

const CardAllBadges = ({
    isLoadingUserData,
    isLoadingCount,
    countBadges,
    myBadges,
    config,
    userData,
}) => {
    return (
        <div className="general-box padding-none height-auto overflow-hidden profile-badges">
            <div className="general-box-header-3 padding-md">
                <label className="gray">
                    {isLoadingUserData && <h5 className="bold">Emblemas de ...</h5>}
                    {!isLoadingUserData && (
                        <h5 className="bold">Emblemas de {userData.username}</h5>
                    )}
                    {isLoadingCount && <h6>... emblemas </h6>}
                    {!isLoadingUserData && !isLoadingCount && (
                        <h6>
                            {countBadges > 1 ? `${countBadges} emblemas` : `${countBadges} emblema`}{" "}
                        </h6>
                    )}
                </label>
            </div>
            <div className="general-box-content padding-md bg-2 grid-all-badges">

                {!isLoadingUserData && myBadges.map((badges, index) => {
                    return <Badge badge={badges} index={index} config={config} />;
                })}
            </div>
        </div>
    );
};

export default CardAllBadges;
