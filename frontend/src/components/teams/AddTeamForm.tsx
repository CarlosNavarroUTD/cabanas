'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AddTeamFormProps {
  onCreateTeam: (teamData: { name: string; description: string }) => Promise<void>;
  isLoading?: boolean;
}

export default function AddTeamForm({ onCreateTeam, isLoading = false }: AddTeamFormProps) {
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateTeam = async () => {
    try {
      if (!teamName) {
        toast({
          title: "Error",
          description: "El nombre del equipo es obligatorio",
          variant: "destructive",
        });
        return;
      }
      
      await onCreateTeam({ name: teamName, description: teamDescription });
      
      // Limpiar formulario y cerrar dialog
      setTeamName('');
      setTeamDescription('');
      setIsDialogOpen(false);
      
      toast({
        title: "Éxito",
        description: "Equipo creado correctamente",
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? 
        error.message : 
        (error as { response?: { data?: { error?: string } } })?.response?.data?.error || "Error al crear el equipo";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      // Limpiar formulario cuando se cierra el dialog
      setTeamName('');
      setTeamDescription('');
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Crear Equipo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear nuevo equipo</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Nombre del equipo"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
          <Textarea
            placeholder="Descripción (opcional)"
            value={teamDescription}
            onChange={(e) => setTeamDescription(e.target.value)}
          />
          <Button 
            onClick={handleCreateTeam}
            disabled={isLoading}
          >
            {isLoading ? 'Creando...' : 'Crear equipo'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}