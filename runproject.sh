#!/bin/bash

# პროექტის მთავარი დირექტორია
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "================================="
echo "   MyHood პროექტის გაშვება...  "
echo "================================="

# ბექენდის (Django) გაშვება ფონურ რეჟიმში
echo "[1/2] ბექენდის (Django) ჩართვა..."
cd "$DIR"
source venv/bin/activate
python manage.py runserver &
BACKEND_PID=$!

# ფრონტენდის (Vite/React) გაშვება ფონურ რეჟიმში
echo "[2/2] ფრონტენდის (React) ჩართვა..."
cd "$DIR/myhood_frontend"
source ~/.nvm/nvm.sh 2>/dev/null
npm run dev &
FRONTEND_PID=$!

echo "================================="
echo " სერვერები წარმატებით გაეშვა!  "
echo " შეჩერებისთვის დააჭირეთ Ctrl+C "
echo "================================="

# Ctrl+C (SIGINT) დაჭერისას ორივე პროცესის შეჩერება
trap "echo -e '\nსერვერების გათიშვა...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT TERM

# ველოდებით პროცესების დასრულებას
wait $BACKEND_PID $FRONTEND_PID
