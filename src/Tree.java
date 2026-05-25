public class Tree{
    static int tree(int num){
        if(num<=1)
           { return 1;}

        return tree(num-1) + tree(num-2);
        }

    public static void main(String[] args) {
        System.out.println(tree(45));

    }
}