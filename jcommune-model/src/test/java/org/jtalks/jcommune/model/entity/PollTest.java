/**
 * Copyright (C) 2011  JTalks.org Team
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 */
package org.jtalks.jcommune.model.entity;

import org.joda.time.DateTime;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

/**
 * 
 * @author Anuar Nurmakanov
 *
 */
public class PollTest {
    private Poll poll;
    
    @BeforeMethod
    public void init() {
        poll = new Poll("It's one of the bost polls in history.");
    }
    
    @Test
    public void testCalculateTotaVotesCount() {
        int firstOptionVotesCount = 10;
        PollOption firstOption = new PollOption("First option");
        firstOption.setVoteCount(firstOptionVotesCount);
        int secondOptionVotesCount = 50;
        PollOption secondOption = new PollOption("Second option");
        secondOption.setVoteCount(secondOptionVotesCount);
        
        poll.addPollOption(firstOption);
        poll.addPollOption(secondOption);
        
        int totalVotesCount = poll.getTotalVoteCount();
        
        Assert.assertEquals(totalVotesCount, firstOptionVotesCount + secondOptionVotesCount, 
                "The total count of votes calculats wrong.");
        
    }
    
    @Test
    public void testIsPollActive() {
        DateTime endingDate = new DateTime(3225, 1, 1, 0, 0, 0, 0);
        poll.setEndingDate(endingDate);
        boolean expected = true;
        
        boolean result = poll.isActive();
        
        Assert.assertEquals(result, expected, "Poll must be active");
    }
    
    @Test
    public void testIsPollInactive() {
        DateTime endingDate = new DateTime(1999, 1, 1, 0, 0, 0, 0);
        poll.setEndingDate(endingDate);
        boolean expected = false;
        
        boolean result = poll.isActive();
        
        Assert.assertEquals(result, expected, "Poll must be inactive");
    }
}
