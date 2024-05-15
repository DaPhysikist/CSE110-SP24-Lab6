describe('Basic user flow for note taking app', () => {
    // First, visit the app
    beforeAll(async () => {
        await page.goto('http://127.0.0.1:5500/index.html');
        page.on('dialog', async dialog => {
            await dialog.accept();
        });
    });

    it('Button should change to a plus when hovering over it', async () => {
        console.log('Checking for button changing during hover...');
        const checkButtonBeforeHover = await page.$eval('button', btn => {
            return btn.innerText;
        });
        expect(checkButtonBeforeHover).toBe("Add Note");
        await page.hover('button');
        const checkButtonDuringHover = await page.$eval('button', btn => {
            return btn.innerText;
        });
        expect(checkButtonDuringHover).toBe("+");
    });

    it('Should be able to add new note by clicking the add note button', async () => {
        console.log('Checking for adding new note...');
        const prevNotes = await page.evaluate(() => {
            return localStorage.getItem("stickynotes-notes");
        });
        const prevNoteCount = await page.$$eval('#notes-app .note', notes => notes.length);
        expect(prevNotes).toBeNull;
        expect(prevNoteCount).toBe(0);

        await page.$eval('button', btn => {
            btn.click();
        });

        const newNotes = await page.evaluate(() => {
            return localStorage.getItem("stickynotes-notes");
        });
        const newNoteCount = await page.$$eval('#notes-app .note', notes => notes.length);

        expect(newNotes).not.toBeNull;
        expect(newNoteCount).toBe(1);
    });

    it('New notes can be edited', async () => {
        console.log('Checking to see if new notes can be edited...');
        
        const prevNoteText = await page.$eval('#notes-app .note', note => {
            return note.value;
        });

        expect(prevNoteText).toBe("");

        await page.type('#notes-app .note', "Hello");
        await page.keyboard.press("Tab");

        const newNoteText = await page.$eval('#notes-app .note', note => {
            return note.value;
        });

        expect(newNoteText).toBe("Hello");
    });

    it('Existing notes can be edited', async () => {
        console.log('Checking to see if existing notes can be edited...');
        
        console.log('Checking to see if new notes can be edited...');
        
        const prevNoteText = await page.$eval('#notes-app .note', note => {
            return note.value;
        });

        await page.type('#notes-app .note', "World");
        await page.keyboard.press("Tab");

        const newNoteText = await page.$eval('#notes-app .note', note => {
            return note.value;
        });

        expect(prevNoteText).toBe("Hello");
        expect(newNoteText).toBe("HelloWorld");
    });

    it('Notes should still be there after refreshing the page', async () => {
        console.log('Checking for notes saved locally...');
        const prevNotes = await page.evaluate(() => {
            return localStorage.getItem("stickynotes-notes");
        });
        const prevNoteCount = await page.$$eval('#notes-app .note', notes => notes.length);
        expect(prevNotes).not.toBeNull;
        expect(prevNoteCount).toBe(1);

        await page.reload();

        const newNotes = await page.evaluate(() => {
            return localStorage.getItem("stickynotes-notes");
        });
        const newNoteCount = await page.$$eval('#notes-app .note', notes => notes.length);

        expect(newNotes).not.toBeNull;
        expect(newNoteCount).toBe(1); 
    });

    it('Individual notes can be deleted', async () => {
        console.log('Checking to see if individual notes are deleted properly...');
        const prevNotes = await page.evaluate(() => {
            return localStorage.getItem("stickynotes-notes");
        });
        const prevNoteCount = await page.$$eval('#notes-app .note', notes => notes.length);
        expect(prevNotes).not.toBeNull;
        expect(prevNoteCount).toBe(1);      

        await page.click('.note', {clickCount: 2});

        const newNotes = await page.evaluate(() => {
            return localStorage.getItem("stickynotes-notes");
        });
        const newNoteCount = await page.$$eval('#notes-app .note', notes => notes.length);

        expect(newNotes).toBeNull;
        expect(newNoteCount).toBe(0);  
    });

    it('Multiple notes can be deleted', async () => {
        await page.$eval('button', btn => {
            btn.click();
            btn.click();
            btn.click();
        });
        
        const prevNotes = await page.evaluate(() => {
            return localStorage.getItem("stickynotes-notes");
        });
        const prevNoteCount = await page.$$eval('#notes-app .note', notes => notes.length);

        expect(prevNotes).not.toBeNull;
        expect(prevNoteCount).toBe(3);      

        await page.keyboard.down('Control')
        await page.keyboard.down('Shift');
        await page.keyboard.press('KeyD');
        await page.keyboard.up('Control');
        await page.keyboard.up('Shift');

        const newNotes = await page.evaluate(() => {
            return localStorage.getItem("stickynotes-notes");
        });
        const newNoteCount = await page.$$eval('#notes-app .note', notes => notes.length);

        expect(newNotes).toBeNull;
       expect(newNoteCount).toBe(0);
    });
});
  