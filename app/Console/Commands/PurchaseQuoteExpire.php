<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\PurchaseQuote\PurchaseQuoteHeaderController;

class PurchaseQuoteExpire extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'purchasequote:expire';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Expire Purchase Quotes exceeding valid period';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    protected $purchase_quote_header_controller;
    
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        //job runs daily 12:30AM
        $this->purchase_quote_header_controller = new PurchaseQuoteHeaderController();
        
        $this->purchase_quote_header_controller->setPurchaseQuoteStatus($this->purchase_quote_header_controller->getExpiringPuchaseQuotes(), 3);
    }
}
