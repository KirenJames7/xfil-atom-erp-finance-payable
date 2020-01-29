<?php

namespace App\Http\Middleware;

use Closure;

class ETagMW
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $response = $next($request);
        if ($request->isMethod('get')) {
            $etag = hash('sha256', json_encode($response->headers->get('origin')).$response->getContent());
            $requestEtag = str_replace('"', '', $request->getETags());
            if ($requestEtag && $requestEtag[0] == $etag) {
                $response->setNotModified();
            }
            $response->setEtag($etag);
        }
        
        return $response;
    }
}
