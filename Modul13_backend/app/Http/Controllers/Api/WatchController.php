<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WatchLater;
use App\Models\Contents;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Exception;
use Illuminate\Mail\Mailables\Content;

class WatchController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $watch = WatchLater::inRandomOrder()->get();

        return response([
            'message' => 'All Watch Later Retrieved',
            'data' => $watch
        ], 200);
    }

    public function showWatchLaterbyUser($id)
    {
        $user = User::find($id);
        // $content = Contents::find($id);
        // if (!$user) {
        //     return response([
        //         'message' => 'User Not Found',
        //         'data' => null,
        //     ], 400);
        // }
        $watch = WatchLater::with('content')->where('id_user', $user->id)->get();
        $formattedWatch = $watch->map(function ($item) {
            return [
                'id' => $item->id,
                'date_added' => Carbon::parse($item->date_added)->format('Y-m-d'),
                'content' => $item->content,
            ];
        });
        return response([
            'message' => 'Contents of ' . $user->name . ' Retrieved',
            'data' => $formattedWatch
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $storeData = $request->all();

            $idUser = Auth::user()->id;
            $user = User::find($idUser);

            if (is_null($user)) {
                return response(['message' => 'User Not Found'], 404);
            }

            $existingWatchLater = WatchLater::where(['id_user' => $user->id, 'id_content' => $storeData['id_content']])->exists();


            if ($existingWatchLater) {
                return response()->json([
                    "message" => "Already in your Watch Later"
                ], 400);
            }

            $content = Contents::find($storeData["id_content"]);

            if ($content["id_user"] == $idUser) {
                return response()->json([
                    "message" => "Can't add your own Videos"
                ], 400);
            }

            $storeData["date_added"] = now();
            $storeData["id_user"] = $idUser;
            $storeData["id_content"] = $content["id"];

            $watch = WatchLater::create($storeData);

            return response()->json([
                "message" => "Added to Your Watch Later List"
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                "message" => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $watch = WatchLater::find($id);

        if (is_null($watch)) {
            return response([
                'message' => 'Watch Not Found',
                'data' => null
            ], 404);
        }

        if ($watch->delete()) {
            return response([
                'message' => 'Remove From Your Watch Later List',
                'data' => $watch,
            ], 200);
        }

        return response([
            'message' => 'Delete Watch Failed',
            'data' => null,
        ], 400);
    }
}
